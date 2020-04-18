import React from "react";
import {
  Typography,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Add, Delete, Help } from "@material-ui/icons";
import useStyles from "./styles";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { formSchema } from "@telegram-form-bot/schemas";

import { yupResolver } from "@hookform/resolvers";

import TextField from "./text-field";

const resolver = yupResolver(formSchema);

// Yep, nice naming
const FormForm = ({
  defaultValues,
  title,
  submitButtonText,
  onSubmit,
  onCancel,
  isFetching,
}) => {
  const { control, register, errors, handleSubmit } = useForm({
    resolver,
    mode: "onChange",
    // All extra properties (createdAt, updatedAt, etc.) from currentlyEditedForm get removed
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">{title}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Name"
            errors={errors}
            register={register}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.fieldset}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  component="legend"
                  className={classes.centerAlign}
                >
                  URLs{" "}
                  <Tooltip
                    title="'URL' is where the form is located; submits are allowed only from this URL. 'Redirect URL' is where the user will be redirected after a successful submit"
                    placement="right"
                  >
                    <Help />
                  </Tooltip>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="url"
                  label="Form URL"
                  errors={errors}
                  register={register}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="redirectUrl"
                  label="Redirect URL"
                  errors={errors}
                  register={register}
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.fieldset}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  component="legend"
                  className={classes.centerAlign}
                >
                  Fields{" "}
                  <Tooltip
                    title={`Name should match the input "name" attribute; description will be shown in notifications`}
                    placement="right"
                  >
                    <Help />
                  </Tooltip>
                </Typography>
              </Grid>

              {fields.map((field, index) => (
                <Grid item container spacing={2} wrap="nowrap" key={field.id}>
                  <Grid item container xs="auto" spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        name={`fields[${index}].name`}
                        label="Name"
                        errors={errors}
                        register={register()}
                        defaultValue={field.name}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        name={`fields[${index}].description`}
                        label="Description"
                        errors={errors}
                        register={register()}
                        defaultValue={field.description}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs="auto" className={classes.centerAlign}>
                    <IconButton
                      aria-label="Remove field"
                      size="small"
                      color="primary"
                      disabled={fields.length === 1}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => append({ name: "", description: "" })}
                >
                  Add field
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="notificationsEnabled"
                render={({ onChange, onBlur, value }) => (
                  <Switch
                    color="primary"
                    onBlur={onBlur}
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Notifications"
          />
        </Grid>

        <Grid item xs={12} container spacing={2}>
          <Grid item xs="auto">
            {/* TODO: disable when no values are updated */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isFetching}
            >
              {submitButtonText}
            </Button>
          </Grid>

          <Grid item xs="auto">
            <Button color="primary" onClick={onCancel} disabled={isFetching}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

// FormForm.whyDidYouRender = true;

export default FormForm;
