import React, { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

import useError from "hooks/use-error";

// TODO: handle non-critical errors
const ErrorDialog: FC = () => {
  const { error, resetError } = useError();

  const refresh = () => window.location.reload();

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle>Oh, snap!</DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={error.recoverable ? resetError : refresh}
          color="primary"
        >
          {error.recoverable ? "Ok" : "Reload app"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
