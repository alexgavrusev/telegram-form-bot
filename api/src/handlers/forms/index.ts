import debug from "debug";
import {
  formSchema,
  formUpdateSchema,
  formDeletionSchema,
} from "@telegram-form-bot/schemas";
import { AppError } from "@telegram-form-bot/error";

import createHandler, { Handler } from "../../utils/create-handler";
import dbMiddleware, { DbReqField } from "../../middleware/db";
import {
  getUserFromAccessTokenHeader,
  UserReqField,
} from "../../middleware/user";

const log = debug("api:forms");

const getForms: Handler<DbReqField & UserReqField> = async (req, res) => {
  log("Getting user %s forms", req.user._id);
  const forms = await req.db.Form.find({ user: req.user._id })
    .select("-user -__v")
    .sort("-updatedAt")
    .lean();

  res.send(forms);
};

const createFrom: Handler<DbReqField & UserReqField> = async (req, res) => {
  log("Validating creation payload");
  const payload = await formSchema.validate(req.body);

  log("Creating new form");
  const form = await req.db.Form.create({
    user: req.user._id,
    ...payload,
  });

  res.send(form);
};

const updateForm: Handler<DbReqField & UserReqField> = async (req, res) => {
  log("Validating update payload");
  const { _id, ...payload } = await formUpdateSchema.validate(req.body);

  if (Object.keys(payload).length === 0) {
    log("Update payload empty");
    throw new AppError("invalidPayload");
  }

  // TODO: AppError
  log("Updating form %s", _id);
  const form = await req.db.Form.findOneAndUpdate(
    { _id, user: req.user._id },
    payload,
    { new: true }
  ).lean();

  res.send(form);
};

const deleteForm: Handler<DbReqField & UserReqField> = async (req, res) => {
  log("Validating deletion payload");
  const { _id } = await formDeletionSchema.validate(req.body);

  // TODO: AppError
  log("Deleting form %s", _id);
  const form = await req.db.Form.findOneAndDelete({
    _id,
    user: req.user._id,
  }).lean();

  res.send(form);
};

const handler = createHandler({
  urlPrefix: "/api/forms",
});

handler
  .use(dbMiddleware)
  .use(getUserFromAccessTokenHeader)
  .get("/", getForms)
  .post("/", createFrom)
  .patch("/", updateForm)
  .delete("/", deleteForm);

export default handler;
