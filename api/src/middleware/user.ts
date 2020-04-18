import debug from "debug";
import { UserDocument } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";

import { Handler } from "../utils/create-handler";
import getRefreshTokenCookie from "../utils/get-refresh-token-cookie";
import { DbReqField } from "./db";

const log = debug("api:middleware:user");

export type UserReqField = {
  user: UserDocument;
};

export const getUserFromAccessTokenHeader: Handler<
  DbReqField & UserReqField
> = async (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    log("No Authorization header found");
    throw new AppError("badRequest");
  }

  const token = authorization.substring(7);
  req.user = await req.db.User.findByAccessToken(token);

  next();
};

export const sendTokens: Handler<UserReqField> = async (req, res) => {
  const { accessToken, refreshToken } = req.user.generateTokens();

  const refreshTokenCookie = getRefreshTokenCookie(refreshToken);

  res.setHeader("Set-Cookie", refreshTokenCookie);
  res.send({ accessToken });
};

export const removeRefreshToken: Handler<UserReqField> = async (_req, res) => {
  const refreshTokenCookie = getRefreshTokenCookie("");

  res.setHeader("Set-Cookie", refreshTokenCookie);

  res.send({ ok: true });
};
