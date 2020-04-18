import { AppError } from "@telegram-form-bot/error";
import AbortController from "abort-controller";
import debug from "utils/debug";

const log = debug("web:utils:fetch");

type PromiseWithCancel<T> = Promise<T> & { cancel: () => void };

const fetcher = <T>(
  url: RequestInfo,
  opts: Omit<RequestInit, "body"> & { body?: Record<string, unknown> } = {}
) => {
  log("Fetching %s, opts %o", url, opts);

  const controller = new AbortController();
  const signal = controller.signal;

  const { headers, body, ...extraOpts } = opts;

  const promise = fetch(`${process.env.SITE_URL}${url}`, {
    ...extraOpts,
    credentials: "same-origin",
    headers: Object.assign(
      body ? { "Content-Type": "application/json" } : {},
      headers
    ),
    body: JSON.stringify(body),
    signal,
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        log("Error fetching %s: %o", url, data);
        throw new AppError(data.reason);
      }

      log("Fetched %s: %o", url, data);
      return data;
    })
    .catch((err) => {
      if (err instanceof AppError) {
        throw err;
      }

      log("Connection error: %s", err.message);
      throw new AppError("offline");
    }) as PromiseWithCancel<T>;

  promise.cancel = () => {
    log("Cancelling %s %o", url, opts);
    controller.abort();
  };

  return promise;
};

export default fetcher;
