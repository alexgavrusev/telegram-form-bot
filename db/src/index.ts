import debug from "debug";
import mongoose, { DocumentDefinition } from "mongoose";
import {
  getModelForClass,
  ReturnModelType,
  DocumentType,
} from "@typegoose/typegoose";

export { isDocumentArray, isDocument } from "@typegoose/typegoose";
export { MongoError } from "mongodb";

import User from "./classes/user";
import Form from "./classes/form";
import Deeplink from "./classes/deeplink";

export { default as User } from "./classes/user";
export { default as Form } from "./classes/form";
export { default as Deeplink } from "./classes/deeplink";

export type UserModel = ReturnModelType<typeof User>;
export type FormModel = ReturnModelType<typeof Form>;
export type DeeplinkModel = ReturnModelType<typeof Deeplink>;

export type UserDocument = DocumentType<User>;
export type FormDocument = DocumentType<Form>;
export type DeeplinkDocument = DocumentType<Deeplink>;

export { AccessToken } from "./classes/user";
// TODO: figure out if timestamps are needed on client
export type FormObject = Omit<
  DocumentDefinition<FormDocument>,
  "typegooseName" | "user" | "_id" | "createdAt" | "updatedAt"
> & { _id: string; PENDING?: "ADD" | "UPDATE" | "DELETE" };

export type UserObject = Pick<
  DocumentDefinition<UserDocument>,
  "email" | "telegramId"
> & { _id: string };

const log = debug("db");

export default class DB {
  static connection: mongoose.Connection = null;

  static User: UserModel = null;
  static Form: FormModel = null;
  static Deeplink: DeeplinkModel = null;

  static async init() {
    mongoose.set("debug", true);

    if (this.connection) {
      log("Using cached connection");
      return this;
    }

    log("Creating connection");
    this.connection = await mongoose.createConnection(process.env.DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      bufferCommands: false,
      bufferMaxEntries: 0,
      autoIndex: process.env.NODE_ENV === "development",
    });

    log("Initializing models");
    this.User = getModelForClass(User, { existingConnection: this.connection });
    this.Form = getModelForClass(Form, {
      existingConnection: this.connection,
      schemaOptions: { timestamps: true },
    });
    this.Deeplink = getModelForClass(Deeplink, {
      existingConnection: this.connection,
    });

    return this;
  }
}
