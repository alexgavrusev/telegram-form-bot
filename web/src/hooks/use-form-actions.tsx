import { useQueryCache, useMutation } from "react-query";
import type { FormObject } from "@telegram-form-bot/db";
import { AppError } from "@telegram-form-bot/error";

import debug from "utils/debug";
import fetch from "utils/fetch";

import useError from "hooks/use-error";
import { AccessTokenObject } from "hooks/use-user";

const log = debug("utils:useFormActions");

export type FormUpdatePayload = Omit<FormObject, "createdAt" | "updatedAt">;
export type FormCreationPayload = Omit<FormUpdatePayload, "_id">;

type Snapshot = () => void;

const useFormActions = () => {
  const { setError } = useError();
  const queryCache = useQueryCache();

  // Forms could be fetching when mutation is triggered
  // 1. Copy latest fetched forms to the latest query
  // 2. Apply optimistic update
  // 3. Refetch on settled
  const getLatestQueryKey = () => [
    "forms",
    queryCache.getQueryData<AccessTokenObject>("user").accessToken,
  ];

  const getLatestSettledQueryKey = () =>
    queryCache
      .getQueries<FormObject[], AppError>(["forms"])
      .filter((q) => !q.state.isFetching)
      .slice(-1)[0].queryKey;

  const [addOne] = useMutation<
    FormObject,
    AppError,
    FormCreationPayload,
    Snapshot
  >(
    (newForm) => {
      const { accessToken } = queryCache.getQueryData<AccessTokenObject>(
        "user"
      );

      return fetch("/api/forms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: newForm,
      });
    },
    {
      onMutate: async (newForm) => {
        log("Optimistically adding form");

        const latestQueryKey = getLatestQueryKey();
        const latestSettledQueryKey = getLatestSettledQueryKey();

        queryCache.cancelQueries(latestQueryKey);

        const previous = queryCache.getQueryData<FormObject[]>(
          latestSettledQueryKey
        );

        queryCache.setQueryData<(FormObject | Omit<FormObject, "_id">)[]>(
          latestQueryKey,
          [{ ...newForm, PENDING: "ADD" }, ...previous]
        );

        return () => queryCache.setQueryData(latestQueryKey, previous);
      },
      onError: (error, _newForm, rollback) => {
        log("Form creation error %o", error);
        setError(error);
        rollback();
      },
      onSuccess: () => {
        queryCache.invalidateQueries(getLatestQueryKey());
      },
    }
  );

  const [deleteOne] = useMutation<
    FormObject,
    AppError,
    FormObject["_id"],
    Snapshot
  >(
    (_id) => {
      const { accessToken } = queryCache.getQueryData<AccessTokenObject>(
        "user"
      );

      return fetch("/api/forms", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { _id },
      });
    },
    {
      onMutate: async (_id) => {
        log("Optimistically deleting form");

        const latestQueryKey = getLatestQueryKey();
        const latestSettledQueryKey = getLatestSettledQueryKey();

        queryCache.cancelQueries(latestQueryKey);

        const previous = queryCache.getQueryData<FormObject[]>(
          latestSettledQueryKey
        );

        queryCache.setQueryData<FormObject[]>(
          latestQueryKey,
          previous.map((form) => {
            if (form._id === _id) {
              return { ...form, PENDING: "DELETE" };
            }

            return form;
          })
        );

        return () => queryCache.setQueryData(latestQueryKey, previous);
      },
      onError: (error, _id, rollback) => {
        log("Form deletion error %o", error);
        setError(error);
        rollback();
      },
      onSuccess: () => {
        queryCache.invalidateQueries(getLatestQueryKey());
      },
    }
  );

  const [updateOne] = useMutation<
    FormObject,
    AppError,
    FormUpdatePayload,
    Snapshot
  >(
    (updatedForm) => {
      const { accessToken } = queryCache.getQueryData<AccessTokenObject>(
        "user"
      );

      return fetch("/api/forms", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: updatedForm,
      });
    },
    {
      onMutate: async (updatedForm) => {
        log("Optimisically updating form");

        const latestQueryKey = getLatestQueryKey();
        const latestSettledQueryKey = getLatestSettledQueryKey();

        queryCache.cancelQueries(latestQueryKey);

        const previous = queryCache.getQueryData<FormObject[]>(
          latestSettledQueryKey
        );

        queryCache.setQueryData<FormObject[]>(
          latestQueryKey,
          previous.map((form) => {
            if (form._id === updatedForm._id) {
              return { ...updatedForm, PENDING: "UPDATE" };
            }

            return form;
          })
        );

        return () => queryCache.setQueryData(latestQueryKey, previous);
      },
      onError: (error, _id, rollback) => {
        log("Form update error %o", error);
        setError(error);
        rollback();
      },
      onSuccess: () => {
        queryCache.invalidateQueries(getLatestQueryKey());
      },
    }
  );

  return {
    addOne,
    deleteOne,
    updateOne,
  };
};

export default useFormActions;
