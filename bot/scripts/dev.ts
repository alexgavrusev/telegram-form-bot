import debug from "debug";
import path from "path";
import ngrok from "ngrok";
import dotenv from "dotenv";
import Telegraf from "telegraf";

const log = debug("bot:scripts:dev");

const envPath = path.resolve(__dirname, "..", "..", ".env");
log("Initializing .env path %s", envPath);
dotenv.config({ path: envPath });

const initNgrok = async () => {
  log("Initializing ngrok");
  const url = await ngrok.connect(3000);
  log("Ngrok url %s", url);
  return url;
};

const setWebhook = async (url: string) => {
  const token = process.env.BOT_TOKEN;
  const webhookUrl = `${url}/bot${token}`;

  log("Setting webhook to %s", webhookUrl);
  const bot = new Telegraf(token);
  bot.telegram.setWebhook(webhookUrl);
};

const start = async () => {
  const url = await initNgrok();
  await setWebhook(url);
};

start();
