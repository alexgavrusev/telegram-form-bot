import { AppError } from "@telegram-form-bot/error";

import createContextWithDisplayName from "utils/create-context-with-display-name";

export type ErrorBoundaryState = {
  error: AppError;
};

const errorContext = createContextWithDisplayName<
  ErrorBoundaryState & {
    resetError: () => void;
    setError: (error: AppError) => void;
  }
>("ErrorContext");

export default errorContext;
