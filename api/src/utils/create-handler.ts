import Trouter, { HTTPMethod } from "trouter";
import debug from "debug";
import { ValidationError } from "@telegram-form-bot/schemas";
import { MongoError } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";

import { Request, Response } from "../types";

const log = debug("api:utils:createHandler");

export type ErrorHandler = <E extends Error>(
  err: E,
  req: Request,
  res: Response,
  next?: Next
) => void;

type InitializerOptions = {
  onError?: ErrorHandler;
  onNoMatch?: ErrorHandler;
  urlPrefix?: string;
};

type Initializer = (opts?: InitializerOptions) => Connect;

const isResSent = (res: Response) =>
  res.finished || res.headersSent || res.writableEnded;

type Next = <E extends Error>(err?: E) => void;

export type Handler<AddedRequestFileds = {}, AddedResponseFields = {}> = (
  req: Request & AddedRequestFileds,
  res: Response & AddedResponseFields,
  next?: Next
) => void;

type Pattern = string | RegExp;

type BoundMethod = (patttern: Pattern, ...handlers: Handler[]) => Connect;

type Use = <T>(
  patttern: T extends Pattern ? Pattern : Handler,
  ...handlers: Handler[]
) => Connect;

const methods = [
  "get",
  "head",
  "post",
  "put",
  "delete",
  "options",
  "trace",
  "patch",
] as const;

type Connect = {
  [k in typeof methods[number]]: BoundMethod;
} & {
  (req: Request, res: Response): Promise<void>;
  use: Use;
  handle: (req: Request, res: Response, done: Next) => void;
  apply: (req: Request, res: Response) => Promise<void>;
};

const handleError: ErrorHandler = (err, _req, res) => {
  if (err instanceof MongoError) {
    log("Mongo error %s: %s", err.code, err.message);
    return res.status(500).end();
  }

  if (err instanceof ValidationError) {
    log("Validation errors: %o", err.errors);
    return new AppError("invalidPayload").sendResponse(res);
  }

  if (err instanceof AppError) {
    log("Application error %s; recoverable: %s", err.message, err.recoverable);
    return err.sendResponse(res);
  }

  log("Unkown error: %o", err);
  return new AppError("unknown").sendResponse(res);
};

const createHandler: Initializer = ({
  onError = handleError,
  onNoMatch = handleError.bind(null, new AppError("handlerNotFound")),
  urlPrefix = "",
} = {}): Connect => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore doesn't pick up mapped http method handlers
  const connect: Connect = (req, res) => {
    req.url = req.url.replace(urlPrefix, "");

    return connect.apply(req, res).then(
      () => !isResSent(res) && onNoMatch(req, res),
      (err) => onError(err, req, res)
    );
  };

  const router = new Trouter<Handler>();

  methods.forEach((name) => {
    connect[name] = (patttern, ...handlers) => {
      router.add(name.toUpperCase() as HTTPMethod, patttern, ...handlers);
      return connect;
    };
  });

  connect.use = (pattern: Pattern | Handler, ...handlers: Handler[]) => {
    if (typeof pattern === "string" || pattern instanceof RegExp) {
      router.use(pattern, ...handlers);
    } else {
      router.use("/", ...[pattern, ...handlers]);
    }

    return connect;
  };

  connect.apply = (req, res) =>
    new Promise((resolve, reject) => {
      connect.handle(req, res, (err) => (err ? reject(err) : resolve()));
    });

  connect.handle = (req, res, done) => {
    const { handlers } = router.find(req.method as HTTPMethod, req.url);
    log("Handling %s %s", req.method, req.url);

    let i = 0;
    const len = handlers.length;

    const next: Next = (err) => {
      if (i === len) {
        log("All handlers invoked");
        return done && done(err);
      }

      if (err) {
        return onError(err, req, res, next);
      }

      log("Invoking handler %s out of %s", i + 1, len);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return loop().catch(next);
    };

    async function loop() {
      return handlers[i++](req, res, next);
    }

    next();
  };

  return connect;
};

export default createHandler;
