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
  open: boolean;
  name: string;
  onDismissed: () => void;
  onConfirmed: () => void;
};

const DeleteFormDialog: FC<Props> = ({
  open,
  name,
  onDismissed,
  onConfirmed,
}) => (
  <Dialog open={open} fullWidth maxWidth="xs" onClose={onDismissed}>
    <DialogTitle>Delete form {name}?</DialogTitle>
    <DialogContent>
      <DialogContentText>This action cannot be undone.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDismissed} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirmed} color="primary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteFormDialog;
