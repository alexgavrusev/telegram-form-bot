import React, { FC, useState } from "react";

import { TextField, Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import { loginSchema } from "@telegram-form-bot/schemas";

import ProgressButton from "components/progress-button";
import EmailSentDialog from "components/email-sent-dialog";

import useUser from "hooks/use-user";
import useUserActions from "hooks/use-user-actions";

import useStyles from "./styles";

type FormFields = { email: string };

const resolver = yupResolver<FormFields>(loginSchema);

const Login: FC = () => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    resolver,
  });

  const { isFetching } = useUser();
  const {
    loginMutation: [login, { isIdle, isLoading, isSuccess }],
  } = useUserActions();

  const [dialogDismissed, setDialogDismissed] = useState(false);

  return (
    <div className={classes.container}>
      <form
        onSubmit={handleSubmit(({ email }) => {
          login(email);
        })}
      >
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              variant="outlined"
              name="email"
              label="Email"
              inputRef={register}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item>
            <ProgressButton
              size="large"
              type="submit"
              fullWidth
              disabled={!isIdle || isFetching}
              loading={isLoading}
            >
              Sign Up / Login
            </ProgressButton>
          </Grid>
        </Grid>
      </form>

      <EmailSentDialog
        open={!dialogDismissed && isSuccess}
        onDismiss={() => setDialogDismissed(true)}
      />
    </div>
  );
};

export default Login;
