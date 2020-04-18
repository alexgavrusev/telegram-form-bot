import { usePaginatedQuery } from "react-query";
import type { FormObject } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";

import fetch from "utils/fetch";

import useUser from "hooks/use-user";
import useError from "hooks/use-error";

const useForms = () => {
  const { setError } = useError();
  const { accessToken, isFetching: isFetchingAccessToken } = useUser();

  const { resolvedData: forms, isFetching } = usePaginatedQuery<
    FormObject[],
    AppError,
    ["forms", typeof accessToken]
  >(
    ["forms", accessToken],
    (_key, accessToken) =>
      fetch("/api/forms", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 30,
      onError: (error) => setError(error),
    }
  );

  return {
    forms,
    isFetching: isFetchingAccessToken || isFetching,
  };
};

export default useForms;
