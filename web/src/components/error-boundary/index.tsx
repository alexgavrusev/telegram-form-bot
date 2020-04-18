import React, { Component, ErrorInfo, ReactNode } from "react";
import { AppError } from "@telegram-form-bot/error";
import { queryCache } from "react-query";

import errorContext, { ErrorBoundaryState } from "context/error-context";
import ErrorDialog from "components/error-dialog";

import debug from "utils/debug";

const log = debug("web:components:error-boundary");

type ErrorBoundaryProps = {
  children: ReactNode;
};

// TODO:
// Should dialog retry or hard refresh?
// Should dialog just ok on non-critical errors?
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = {
    error: null,
  };

  resetError = () => {
    log("Resetting");
    queryCache.resetErrorBoundaries();
    this.setState({ error: null });
  };

  setError = (error: AppError) => this.setState({ error });

  static getDerivedStateFromError(
    error: AppError
  ): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    log("Got error %o: %o", error, info);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    console.log("ERROR", error);

    return (
      <errorContext.Provider
        value={{
          error,
          resetError: this.resetError,
          setError: this.setError,
        }}
      >
        {error ? <ErrorDialog /> : null}
        {!error || error.recoverable ? children : null}
      </errorContext.Provider>
    );
  }
}
