import React from "react";
import { Drawer, Container } from "@material-ui/core";

import useDashboardActions from "hooks/use-dashboard-actions";
import useDashboardQueryValidation from "hooks/use-dashboard-query-validation";
import useForms from "hooks/use-forms";
import useFormActions from "hooks/use-form-actions";
import useStaleValue from "hooks/use-stale-value";

import FormForm from "./form-form";

import useStyles from "./styles";

const ActionDrawer = () => {
  const classes = useStyles();
  const { resetAction } = useDashboardActions();

  const { action, id } = useDashboardQueryValidation();
  const { forms, isFetching } = useForms();
  const { addOne, updateOne } = useFormActions();

  // Save form name before update
  const currentlyEditedForm = forms.find((f) => f._id === id);
  const nameBeforeUpdate = useStaleValue(
    currentlyEditedForm?.name,
    currentlyEditedForm && !currentlyEditedForm?.PENDING
  );

  // Preserve computed title and btn text when drawer is closing
  const title = useStaleValue(
    action === "update" ? `Edit form ${nameBeforeUpdate}` : "Add a new form",
    action
  );

  const submitButtonText = useStaleValue(
    action === "update" ? "Update form" : "Create form",
    action
  );

  const onSubmit = async (values) => {
    // Ignore submits after closed
    if (!action) {
      return;
    }

    if (action === "update") {
      updateOne({ _id: currentlyEditedForm._id, ...values });
    } else if (action === "new") {
      addOne(values);
    }

    resetAction();
  };

  const defaultValues = currentlyEditedForm ?? {
    notificationsEnabled: true,
    fields: [{ name: "", description: "" }],
  };

  return (
    <Drawer anchor="right" open={!!action} onClose={resetAction}>
      <Container maxWidth="sm" className={classes.container}>
        <FormForm
          defaultValues={defaultValues}
          title={title}
          submitButtonText={submitButtonText}
          onSubmit={onSubmit}
          onCancel={resetAction}
          isFetching={isFetching}
        />
      </Container>
    </Drawer>
  );
};

// ActionDrawer.whyDidYouRender = true;

export default ActionDrawer;
