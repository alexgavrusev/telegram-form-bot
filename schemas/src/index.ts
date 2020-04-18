import * as yup from "yup";

const email = yup.string().email().required();

export const ValidationError = yup.ValidationError;

export const loginSchema = yup
  .object()
  .shape({ email })
  .noUnknown()
  .strict(true);

// Simple regex to not bring mongoose to the browser bundle
const _id = yup
  .string()
  .matches(/^[0-9a-fA-F]{24}$/)
  .required();

const name = yup.string().required();

const url = yup.string().url().required();

const field = yup
  .object()
  .shape({
    name: yup.string().required(),
    description: yup.string().required(),
  })
  .noUnknown()
  .strict(true);
const fields = yup.array().of(field).required();

const redirectUrl = yup.string().url();

const notificationsEnabled = yup.bool().required();

export const formSchema = yup
  .object()
  .shape({
    name,
    url,
    fields,
    redirectUrl,
    notificationsEnabled,
  })
  .noUnknown()
  .strict(true);

export const formUpdateSchema = formSchema.shape({ _id });

export const formDeletionSchema = yup
  .object()
  .shape({ _id })
  .noUnknown()
  .strict(true);

const formCreationQueryStringSchema = yup
  .object()
  .shape({ action: yup.string().oneOf(["new"]) })
  .noUnknown()
  .strict(true);

const formUpdateQueryStringSchema = yup
  .object()
  .shape({ action: yup.string().oneOf(["update"]), id: _id })
  .noUnknown()
  .strict(true);

const emptyQueryStringSchema = yup.object().shape({}).noUnknown().strict(true);

export type DashboardQueryString = yup.InferType<
  | typeof formCreationQueryStringSchema
  | typeof formUpdateQueryStringSchema
  | typeof emptyQueryStringSchema
>;

const dashboardQueryStrings = [
  formCreationQueryStringSchema,
  formUpdateQueryStringSchema,
  emptyQueryStringSchema,
] as const;

export const dashboardQueryStringSchema = yup
  .mixed<DashboardQueryString>()
  .test({
    name: "dashboardQueryString",
    message: "Invalid dashboard query string",
    test: (value) => {
      // Check if action matches one of the schemas
      // Emulating allSettled with catch
      const validations = dashboardQueryStrings.map((schema) => {
        try {
          return schema.validateSync(value);
        } catch (e) {
          return e;
        }
      });

      return validations.some((item) => !(item instanceof yup.ValidationError));
    },
  });
