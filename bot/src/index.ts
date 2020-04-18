import debug from "debug";
import { NowRequest, NowResponse } from "@vercel/node";
import Telegraf from "telegraf";
import DB from "@telegram-form-bot/db";

const log = debug("bot");

log("Creating bot");
export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore telegraf has invalid types here
  const { startPayload } = ctx as { startPayload: string };
  if (!startPayload) {
    return ctx.reply("No start payload");
  }

  const db = await DB.init();

  const deeplink = await db.Deeplink.findByIdAndDelete(startPayload);
  if (!deeplink) {
    return ctx.reply("Invalid payload");
  }

  await db.User.findByIdAndUpdate(deeplink.user, { telegramId: ctx.from.id });

  return ctx.reply("Telegram linked");
});

export default async (req: NowRequest, res: NowResponse) => {
  if (req.url !== `/bot${process.env.BOT_TOKEN}`) {
    log("Invalid request url %s", req.url);
    return res.status(404).end();
  }

  try {
    await bot.handleUpdate(req.body);
    return res.status(200).end();
  } catch {
    log("Failed to process update");
    return res.status(200).end();
  }
};
