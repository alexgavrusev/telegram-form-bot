import type { AccessToken } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";
import { useQuery } from "react-query";
import jwtDecode from "jwt-decode";

import fetch from "utils/fetch";

import useError from "hooks/use-error";

export type AccessTokenObject = { accessToken: string };

// TODO: error handling, redirects
const useUser = () => {
  const { setError } = useError();

  const { data, isFetching } = useQuery<AccessTokenObject, AppError, "user">(
    "user",
    (_key) => fetch("/api/auth/me"),
    {
      refetchInterval: 1000 * 60 * 5,
      onError: (error) => setError(error),
    }
  );

  const { accessToken } = data;

  if (accessToken === null) {
    return { accessToken, email: null, telegramId: null, isFetching };
  }

  const { email, telegramId } = jwtDecode(accessToken) as AccessToken;

  return { accessToken, email, telegramId, isFetching };
};

export default useUser;
