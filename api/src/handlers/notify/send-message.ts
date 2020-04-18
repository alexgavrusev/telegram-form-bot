import debug from "debug";
import { bot } from "@telegram-form-bot/bot";

import {
  FormObjectWithUser,
  JsonOrUrlEncodedFields,
  FormDataFields,
  FormDataFiles,
} from "./types";

const log = debug("api:notify:send-message");

async function* constructMessagesFromParsedFormData(
  form: FormObjectWithUser,
  fields: FormDataFields,
  files: FormDataFiles
) {
  log("Constructing messages from parsed form data");

  for (const formField of form.fields) {
    const { name, description } = formField;

    const field = fields[name];
    const file = files[name];

    if (field) {
      log(`Got simple text for '${name}' `);
      yield `${description}: ${field.join(", ")}`;
    } else if (file) {
      log(`Got files for '${name}`);

      yield `${description}:`;

      for (const f of file) {
        yield { path: f.path };
      }
    }
  }
}

export const sendMessageFromJsonOrUrlEncodedFields = (
  form: FormObjectWithUser,
  reqBody: JsonOrUrlEncodedFields
) => {
  log("Constructing message from json or url encoded fields");

  const data = Object.entries(reqBody)
    .map(([key, value]) => {
      let str = value;
      if (Array.isArray(value)) {
        str = value.join(", ");
      } else if (typeof value === "object" && value !== null) {
        str = JSON.stringify(value);
      }

      const { description } = form.fields.find((field) => field.name === key);
      return `${description}: ${str}`;
    })
    .join("\n");

  const message = `--- Новая заявка по форме ${form.name} ---\n${data}`;

  log("Sending message");
  return bot.telegram.sendMessage(
    // TODO: user is lean
    form.user.telegramId,
    message
  );
};

export const sendMessagesFromParsedFormData = async (
  form: FormObjectWithUser,
  fields: FormDataFields,
  files: FormDataFiles
) => {
  const { telegramId } = form.user;

  await bot.telegram.sendMessage(
    telegramId,
    `--- Новая заявка по форме ${form.name} ---`
  );

  for await (const message of constructMessagesFromParsedFormData(
    form,
    fields,
    files
  )) {
    if (typeof message === "string") {
      await bot.telegram.sendMessage(telegramId, message);
    } else {
      await bot.telegram.sendDocument(telegramId, { source: message.path });
    }
  }
};
