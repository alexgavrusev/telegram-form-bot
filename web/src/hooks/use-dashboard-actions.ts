import { useCallback } from "react";
import { useRouter } from "next/router";

import type { FormObject } from "@telegram-form-bot/db";

import debug from "utils/debug";

const log = debug("web:hooks:useDashboardActions");

// TODO: disable buttons on revalidate
// TODO: don't show drawer until forms are fetched
// TODO: rename since this also cleanups login token
const useDashboardActions = () => {
  const { push } = useRouter();

  const startCreation = () => {
    log("Starting creation");
    push("/dashboard?action=new", undefined, { shallow: true });
  };

  const startUpdate = (id: FormObject["_id"]) => {
    log("Starting %s update", id);
    push(`/dashboard?action=update&id=${id}`, undefined, {
      shallow: true,
    });
  };

  const resetAction = useCallback(() => {
    log("Resetting action");
    push("/dashboard", undefined, { shallow: true });
  }, [push]);

  return {
    startCreation,
    startUpdate,
    resetAction,
  };
};

export default useDashboardActions;
