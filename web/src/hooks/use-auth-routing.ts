import { useEffect } from "react";
import { useRouter } from "next/router";

import useUser from "hooks/use-user";

import debug from "utils/debug";

const log = debug("web:hooks:useAuthRouting");

type Config = {
  authRoute: string;
  unauthRoute: string;
};

const useAuthRouting = ({ authRoute, unauthRoute }: Config) => {
  const { accessToken } = useUser();
  const { replace, pathname } = useRouter();

  useEffect(() => {
    if (accessToken && authRoute && pathname !== authRoute) {
      log("Access token found, navigating to %s", authRoute);
      replace(authRoute);
    } else if (!accessToken && unauthRoute && pathname !== unauthRoute) {
      log("Access token not found, navigating to %s", unauthRoute);
      replace(unauthRoute);
    }
  }, [accessToken, replace, authRoute, unauthRoute, pathname]);

  const isAuthenticated = !!accessToken;

  return isAuthenticated;
};

export default useAuthRouting;
