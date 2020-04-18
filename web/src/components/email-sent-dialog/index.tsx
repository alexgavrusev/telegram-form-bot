import React, { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

type Props = {
  onDismiss: () => void;
  open: boolean;
};

const EmailSentDialog: FC<Props> = ({ onDismiss, open }) => (
  <Dialog open={open} fullWidth maxWidth="xs" onClose={onDismiss}>
    <DialogTitle>Login link sent</DialogTitle>
    <DialogContent>
      <DialogContentText>Check your email inbox.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDismiss} color="primary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

export default EmailSentDialog;
