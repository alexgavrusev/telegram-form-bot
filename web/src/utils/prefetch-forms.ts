import { queryCache } from "react-query";
import type { FormObject } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";

import { AccessTokenObject } from "hooks/use-user";

import debug from "utils/debug";
import fetch from "utils/fetch";

const log = debug("web:utils:prefetch-forms");

const prefetchForms = async () => {
  log("Prefetching forms");
  const { accessToken } = queryCache.getQueryData<AccessTokenObject>("user");

  await queryCache.prefetchQuery<
    FormObject[],
    AppError,
    ["forms", typeof accessToken]
  >(["forms", accessToken], (_key, accessToken) =>
    fetch("/api/forms", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  );
};

export default prefetchForms;
