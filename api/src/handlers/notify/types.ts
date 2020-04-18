import type { FormObject, UserObject } from "@telegram-form-bot/db";

export type FormObjectWithUser = FormObject & { user: UserObject };

export type JsonOrUrlEncodedFields = { [key: string]: unknown };

export type FormDataFields = { [key: string]: string[] };

type File = {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: unknown;
  size: number;
};

export type FormDataFiles = { [key: string]: File[] };
