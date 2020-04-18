import { randomBytes } from "crypto";

import createHandler, { Handler } from "../../utils/create-handler";
import dbMiddleware, { DbReqField } from "../../middleware/db";
import {
  getUserFromAccessTokenHeader,
  UserReqField,
} from "../../middleware/user";

const redirectToTelegram: Handler<DbReqField & UserReqField> = async (
  req,
  res
) => {
  // Generate 64 random telegram allowed chars
  const deeplinkParam = randomBytes(64 * (3 / 4))
    .toString("base64")
    .replace(/[+/=]/g, "_");

  await req.db.Deeplink.create({ _id: deeplinkParam, user: req.user._id });

  res.send({
    url: `https://t.me/${process.env.BOT_NAME}?start=${deeplinkParam}`,
  });
};

const handler = createHandler({
  urlPrefix: "/api/notification_providers",
});

handler
  .use(dbMiddleware)
  .use(getUserFromAccessTokenHeader)
  .post("/link_telegram", redirectToTelegram);

export default handler;
