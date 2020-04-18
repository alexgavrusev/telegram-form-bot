import React, { FC } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Add } from "@material-ui/icons";

import useDashboardActions from "hooks/use-dashboard-actions";
import useForms from "hooks/use-forms";

const BaseButton: FC<ButtonProps> = (props) => (
  <Button variant="contained" color="primary" startIcon={<Add />} {...props}>
    Add new form
  </Button>
);

export const NewFormButtonSkeleton: FC = () => (
  <Skeleton variant="rect" animation="wave">
    <BaseButton />
  </Skeleton>
);

const NewFormButton: FC = () => {
  const { startCreation } = useDashboardActions();
  const { isFetching } = useForms();

  return (
    <BaseButton onClick={startCreation} disabled={isFetching}>
      Add new form
    </BaseButton>
  );
};

export default NewFormButton;
