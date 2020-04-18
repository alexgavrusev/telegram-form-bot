import nodemailer from "nodemailer";
import { loginSchema } from "@telegram-form-bot/schemas";
import { AppError } from "@telegram-form-bot/error";
import debug from "debug";

import createHandler, { Handler } from "../../utils/create-handler";
import getRefreshTokenCookie from "../../utils/get-refresh-token-cookie";
import dbMiddleware, { DbReqField } from "../../middleware/db";
import {
  UserReqField,
  sendTokens,
  getUserFromAccessTokenHeader,
  removeRefreshToken,
} from "../../middleware/user";

const log = debug("api:auth");

const transporter = nodemailer.createTransport({
  service: "SendinBlue",
  auth: {
    user: process.env.SB_EMAIL,
    pass: process.env.SB_PASS,
  },
});

const sendLoginLink: Handler<DbReqField> = async (req, res) => {
  log("Validating email");
  const { email } = await loginSchema.validate(req.body);

  const token = req.db.User.generateLoginToken(email);

  // TODO: AppError
  try {
    log("Sending email");
    const result = await transporter.sendMail({
      from: process.env.SB_EMAIL,
      to: email,
      subject: "FormBot login",
      html: `Link: <a href="${process.env.SITE_URL}/api/auth/callback?token=${token}">Login</a>`,
    });
    log("Sent email %o", result);
  } catch {
    throw new AppError("emailSendFail");
  }

  res.send({ ok: true });
};

const getUserFromLoginToken: Handler<DbReqField & UserReqField> = async (
  req,
  _res,
  next
) => {
  log("Getting token from query");
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    log("Invalid token");
    throw new AppError("badRequest");
  }

  req.user = await req.db.User.findOrCreateFromLoginToken(token);

  next();
};

const redirectToDashboardWithRefreshToken: Handler<UserReqField> = async (
  req,
  res
) => {
  const { refreshToken } = req.user.generateTokens();

  const refreshTokenCookie = getRefreshTokenCookie(refreshToken);

  res.setHeader("Set-Cookie", refreshTokenCookie);
  res.setHeader("Location", `/dashboard`);
  res.status(302).end();
};

const getUserFromRefreshTokenCookie: Handler<
  DbReqField & UserReqField
> = async (req, res, next) => {
  const { refresh } = req.cookies;
  if (!refresh) {
    log("No refresh token cookie found");
    return res.send({ accessToken: null });
  }

  req.user = await req.db.User.findByRefreshToken(refresh);

  next();
};

const handler = createHandler({ urlPrefix: "/api/auth" });

handler
  .use(dbMiddleware)
  // TODO: fail if already authorized
  .post("/send_login_link", sendLoginLink)
  .get(/callback/, getUserFromLoginToken, redirectToDashboardWithRefreshToken)
  .get("/me", getUserFromRefreshTokenCookie, sendTokens)
  .post("/logout", getUserFromAccessTokenHeader, removeRefreshToken);

export default handler;
