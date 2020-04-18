import DB from "@telegram-form-bot/db";

import { Handler } from "../utils/create-handler";

export type DbReqField = {
  db: typeof DB;
};

const dbMiddleware: Handler<DbReqField> = async (req, _res, next) => {
  req.db = await DB.init();

  next();
};

export default dbMiddleware;
