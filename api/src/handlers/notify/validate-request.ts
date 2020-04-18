import type { FormObject } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";
import debug from "debug";

import { JsonOrUrlEncodedFields, FormDataFields, FormDataFiles } from "./types";

const log = debug("api:notify:validate-request");

const validateProvidedFieldNames = (
  form: FormObject,
  providedFieldName: string[]
) => {
  const formFieldNames = form.fields.map((f) => f.name);

  const extraFields = providedFieldName.filter(
    (key) => !formFieldNames.includes(key)
  );
  const missingFields = formFieldNames.filter(
    (key) => !providedFieldName.includes(key)
  );

  if (extraFields.length > 0) {
    const extraKeysStr = extraFields.join(", ");
    log("Got extra fields: %s", extraKeysStr);
    // TODO: specify
    throw new AppError("badRequest");
    // throw new ErrorWithStatusCode(
    //   `Invalid submit — extra fields: ${extraFields.join(", ")}`,
    //   400
    // );
  }

  if (missingFields.length > 0) {
    const missingKeysStr = missingFields.join(", ");
    log("Missing fields: %s", missingKeysStr);
  }
};

export const validateJsonOrUrlEncodedBody = (
  form: FormObject,
  reqBody: JsonOrUrlEncodedFields
) => {
  log("Checking json or url encoded fields");
  validateProvidedFieldNames(form, Object.keys(reqBody));
};

export const validateParsedFormData = (
  form: FormObject,
  fields: FormDataFields,
  files: FormDataFiles
) => {
  const fieldNames = Object.keys(fields);
  const fileNames = Object.keys(files);

  fieldNames.forEach((key) => {
    if (fileNames.includes(key)) {
      throw new AppError("badRequest");
      // throw new ErrorWithStatusCode(
      //   `Found both field and file named ${key}`,
      //   400
      // );
    }
  });

  const providedFieldNames = [...fieldNames, ...fileNames];

  validateProvidedFieldNames(form, providedFieldNames);
};
