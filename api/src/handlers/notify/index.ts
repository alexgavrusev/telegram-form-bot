import debug from "debug";
import Cors from "cors";
import multiparty from "multiparty";
import contentType from "content-type";
import { AppError } from "@telegram-form-bot/error";

import createHandler, { Handler } from "../../utils/create-handler";
import dbMiddleware, { DbReqField } from "../../middleware/db";
import { Request } from "../../types";
import { FormObjectWithUser, FormDataFields, FormDataFiles } from "./types";

import {
  sendMessageFromJsonOrUrlEncodedFields,
  sendMessagesFromParsedFormData,
} from "./send-message";
import {
  validateJsonOrUrlEncodedBody,
  validateParsedFormData,
} from "./validate-request";

const log = debug("api:notify");

type FormReqField = {
  form: FormObjectWithUser;
};

const promisifyFormParse = (req: Request, form: multiparty.Form) =>
  new Promise<[FormDataFields, FormDataFiles]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }

      resolve([fields, files]);
    });
  });

const getFormFromId: Handler<DbReqField & FormReqField> = async (
  req,
  _res,
  next
) => {
  const referer = req.headers["referer"];

  if (!referer) {
    throw new AppError("badRequest");
  }

  const formId = req.url.substring(1);
  log("Getting form id %s", formId);
  const form = (await req.db.Form.findById(formId)
    .populate("user")
    .lean()) as FormObjectWithUser;

  if (!form) {
    log("Form not found");
    throw new AppError("badRequest");
  }

  const refererUrl = new URL(referer);
  const formUrl = new URL(form.url);

  if (formUrl.origin !== refererUrl.origin) {
    // TODO: specify
    log("Form and referer url origin mismatch");
    throw new AppError("badRequest");
  }

  // if (!form.user) {
  //   log("User not found");
  //   throw new AppError("badRequest")
  //   throw new ErrorWithStatusCode("User not found", 400);
  // }

  if (!form.user.telegramId) {
    log("Telegram not linked");
    // TODO: specify
    throw new AppError("badRequest");
  }

  req.form = form;
  next();
};

const redirectOrReturn: Handler<FormReqField> = async (req, res) => {
  if (req.form.redirectUrl) {
    log("Redirecting to %s", req.form.redirectUrl);
    res.setHeader("Location", req.form.redirectUrl);
    return res.status(302).end();
  }

  log("Sending ok response");
  return res.send({ ok: true });
};

const notify: Handler<FormReqField> = async (req, _res, next) => {
  const { type } = contentType.parse(req.headers["content-type"]);

  switch (type) {
    case "application/json":
    case "application/x-www-form-urlencoded":
      validateJsonOrUrlEncodedBody(req.form, req.body);

      await sendMessageFromJsonOrUrlEncodedFields(req.form, req.body);
      next();
      break;

    case "multipart/form-data":
      const form = new multiparty.Form();
      const [fields, files] = await promisifyFormParse(req, form);

      validateParsedFormData(req.form, fields, files);

      await sendMessagesFromParsedFormData(req.form, fields, files);

      next();
      break;

    default:
      throw new AppError("badRequest");
  }
};

const handler = createHandler({
  urlPrefix: "/api/notify",
});

const cors = Cors() as Handler;

handler
  .use(dbMiddleware)
  .options(new RegExp(".*"), cors)
  .post(new RegExp(".*"), cors, getFormFromId, notify, redirectOrReturn);

export default handler;
