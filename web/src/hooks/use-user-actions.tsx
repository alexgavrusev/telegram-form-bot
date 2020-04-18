import { AppError } from "@telegram-form-bot/error";
import { useQueryCache, useMutation } from "react-query";
import Router from "next/router";

import useError from "hooks/use-error";
import { AccessTokenObject } from "hooks/use-user";

import fetch from "utils/fetch";
import debug from "utils/debug";

const log = debug("web:hooks:useUserActions");

const useUserActions = () => {
  const queryCache = useQueryCache();
  const { setError } = useError();

  const loginMutation = useMutation<{ ok: true }, AppError, string>(
    (email) =>
      fetch("/api/auth/send_login_link", {
        method: "POST",
        body: { email },
      }),
    {
      onError: (error) => {
        log("Login link sending error %o", error);
        setError(error);
      },
    }
  );

  const logoutMutation = useMutation<{ ok: true }, AppError, undefined>(
    () => {
      const { accessToken } = queryCache.getQueryData<AccessTokenObject>(
        "user"
      );

      return fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    {
      onSuccess: async () => {
        log("Removing token from cache");
        queryCache.removeQueries("user");

        log("Navigating to /login");
        await Router.replace("/login");
      },
      onError: (error) => {
        log("Logout error: %s", error.message);
        setError(error);
      },
    }
  );

  const linkTelegramMutation = useMutation<
    { url: string },
    AppError,
    undefined
  >(
    async () => {
      const { accessToken } = queryCache.getQueryData<AccessTokenObject>(
        "user"
      );

      return fetch("/api/notification_providers/link_telegram", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    },
    {
      onSuccess: ({ url }) => {
        log("Navigating to telegram bot link");
        window.location.href = url;
      },
      onError: (error) => {
        log("Login link sending error %o", error);
        setError(error);
      },
    }
  );

  return { loginMutation, logoutMutation, linkTelegramMutation };
};

export default useUserActions;
