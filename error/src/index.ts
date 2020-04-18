import type { NowResponse } from "@vercel/node";

type ErrorOptions = {
  recoverable: boolean;
  message: string;
  statusCode: number;
};

type ErrorReason =
  | "invalidPayload"
  | "badRequest"
  | "emailSendFail"
  | "invalidLoginToken"
  | "invalidRefreshToken"
  | "invalidAccessToken"
  | "userNotFound"
  | "unknown"
  | "handlerNotFound"
  | "offline";

export const errors: Record<ErrorReason, ErrorOptions> = {
  handlerNotFound: {
    recoverable: false,
    message: "Not found",
    statusCode: 404,
  },
  invalidPayload: {
    recoverable: true,
    message: "Invalid payload",
    statusCode: 400,
  },
  emailSendFail: {
    recoverable: true,
    message: "Failed to send email",
    statusCode: 500,
  },
  invalidLoginToken: {
    recoverable: false,
    message: "Invalid login token",
    statusCode: 403,
  },
  invalidRefreshToken: {
    recoverable: true,
    message: "Invalid refresh token",
    statusCode: 403,
  },
  invalidAccessToken: {
    recoverable: true,
    message: "Invalid  access token",
    statusCode: 403,
  },
  userNotFound: {
    recoverable: false,
    message: "User not found",
    statusCode: 404,
  },
  badRequest: {
    recoverable: false,
    message: "Bad request",
    statusCode: 400,
  },
  unknown: {
    recoverable: false,
    message: "Unknown error",
    statusCode: 500,
  },
  offline: {
    recoverable: false,
    message: "You are offline",
    statusCode: 0,
  },
};

export class AppError extends Error {
  recoverable: boolean;
  message: string;
  statusCode: number;
  reason: ErrorReason;

  constructor(reason: ErrorReason) {
    const { message, recoverable, statusCode } = errors[reason];

    super(message);
    this.recoverable = recoverable;
    this.statusCode = statusCode;
    this.reason = reason;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  sendResponse(res: NowResponse) {
    const { statusCode, message, recoverable, reason } = this;

    res.status(statusCode).send({
      message,
      recoverable,
      reason,
    });
  }
}
