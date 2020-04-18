import { useLayoutEffect } from "react";
import { AppError } from "@telegram-form-bot/error";

import useError from "hooks/use-error";

const Fallback = () => {
  const { setError } = useError();

  useLayoutEffect(() => {
    setError(new AppError("offline"));
  }, [setError]);

  return null;
};

export default Fallback;
