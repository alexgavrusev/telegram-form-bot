import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  dashboardQueryStringSchema,
  DashboardQueryString,
} from "@telegram-form-bot/schemas";

import useDashboardActions from "hooks/use-dashboard-actions";
import useForms from "hooks/use-forms";

import debug from "utils/debug";

const log = debug("web:hooks:useDashboardQueryValidation");

// Assumes that router.query is populated, works bc suspends on init render
const useDashboardQueryValidation = () => {
  const { query } = useRouter();
  const { resetAction } = useDashboardActions();
  const { forms } = useForms();

  let valid = true;

  log("Validating action");

  let dashboardAction: DashboardQueryString;
  try {
    dashboardAction = dashboardQueryStringSchema.validateSync(query);
  } catch (e) {
    log("Validatiion error");
    valid = false;
  }

  if (valid && "id" in dashboardAction) {
    log("Checking if updated form still exists");

    const { id } = dashboardAction;
    const form = forms.find((f) => f._id === id);
    if (!form) {
      log("Updated form not found");
      valid = false;
    }
  }

  useEffect(() => {
    if (!valid) {
      resetAction();
    }
  }, [query, resetAction, valid]);

  if (!valid) {
    return {};
  }

  return dashboardAction;
};

export default useDashboardQueryValidation;
