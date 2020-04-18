import { prop, Ref, ReturnModelType, DocumentType } from "@typegoose/typegoose";
import { AppError } from "@telegram-form-bot/error";
import jwt, { Secret } from "jsonwebtoken";
import debug from "debug";

import Form from "./form";

const log = debug("db:classes:user");

export type AccessToken = {
  id: string;
  email: string;
  telegramId: number;
};

type RefreshToken = {
  id: string;
};

type LoginToken = {
  email: string;
};

export default class User {
  @prop({ required: true, unique: true })
  email!: string;

  @prop({ default: null })
  telegramId!: number;

  @prop({ ref: () => Form, foreignField: "user", localField: "_id" })
  forms!: Ref<Form>[];

  _generateAccessToken(this: DocumentType<User>) {
    return jwt.sign(
      { id: this._id, email: this.email, telegramId: this.telegramId },
      "access",
      { expiresIn: "15m" }
    );
  }

  _generateRefreshToken(this: DocumentType<User>) {
    return jwt.sign({ id: this._id }, "refresh", { expiresIn: "7d" });
  }

  generateTokens(this: DocumentType<User>) {
    const accessToken = this._generateAccessToken();
    const refreshToken = this._generateRefreshToken();

    return { accessToken, refreshToken };
  }

  static _verifyToken<T extends Record<string, unknown>>(
    this: ReturnModelType<typeof User>,
    type: "login" | "refresh" | "access",
    token: string,
    secret: Secret
  ) {
    try {
      log("Verifying %s token", type);
      const decoded = jwt.verify(token, secret) as T;
      return decoded;
    } catch {
      switch (type) {
        case "login":
          throw new AppError("invalidLoginToken");
        case "refresh":
          throw new AppError("invalidRefreshToken");
        case "access":
          throw new AppError("invalidAccessToken");
      }
    }
  }

  static async _findByIdWithThrow(
    this: ReturnModelType<typeof User>,
    id: unknown
  ) {
    const user = await this.findById(id);

    if (!user) {
      throw new AppError("userNotFound");
    }

    return user;
  }

  static findByAccessToken(
    this: ReturnModelType<typeof User>,
    accessToken: string
  ) {
    const { id } = this._verifyToken<AccessToken>(
      "access",
      accessToken,
      "access"
    );

    return this._findByIdWithThrow(id);
  }

  static findByRefreshToken(
    this: ReturnModelType<typeof User>,
    refreshToken: string
  ) {
    const { id } = this._verifyToken<RefreshToken>(
      "refresh",
      refreshToken,
      "refresh"
    );

    return this._findByIdWithThrow(id);
  }

  static generateLoginToken(this: ReturnModelType<typeof User>, email: string) {
    log("Generating login token for %s", email);
    return jwt.sign({ email }, "login", { expiresIn: "1d" });
  }

  static async findOrCreateFromLoginToken(
    this: ReturnModelType<typeof User>,
    loginToken: string
  ) {
    const { email } = this._verifyToken<LoginToken>(
      "login",
      loginToken,
      "login"
    );

    log("Finding user %s", email);
    let user = await this.findOne({ email });
    if (!user) {
      log("No user %s found, creating new", email);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TS wants to have telegramId and forms here
      user = await this.create({ email });
    }

    return user;
  }
}
