import React, { FC, useState } from "react";
import copy from "copy-to-clipboard";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  IconButton,
  LinearProgress,
  SvgIcon,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Create, Delete } from "@material-ui/icons";
import clsx from "clsx";

import DeleteFormDialog from "components/delete-form-dialog";

import useForms from "hooks/use-forms";
import useFormActions from "hooks/use-form-actions";
import useDashboardActions from "hooks/use-dashboard-actions";
import useSelectedForm from "hooks/use-selected-form";

import useStyles from "./styles";

const CopyContent: FC = () => (
  <SvgIcon>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </SvgIcon>
);

export const FormListSkeleton: FC = () => (
  <Skeleton variant="rect" width="100%" height={138} animation="wave" />
);

const FormList: FC = () => {
  const classes = useStyles();

  const { forms, isFetching } = useForms();
  const { deleteOne } = useFormActions();
  const { startUpdate } = useDashboardActions();

  const [selectedForm, setSelectedFormId] = useSelectedForm();

  const [showedCopyTooltipIndex, setShowewCopyTooltipIndex] = useState(-1);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Submit URL</TableCell>
              <TableCell>Notifications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map(
              ({ _id, name, notificationsEnabled, PENDING }, index) => {
                // Hide optimistically deleted forms
                if (PENDING === "DELETE") {
                  return null;
                }

                const submitUrl = `${process.env.SITE_URL}/api/notify/${_id}`;

                return (
                  <TableRow
                    // _id is not available on optimistic creation
                    key={_id || index}
                    className={clsx(
                      classes.itemRow,
                      PENDING && classes.pendingItem
                    )}
                  >
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    {_id ? (
                      <TableCell>
                        <div className={classes.submitUrlContainer}>
                          {submitUrl}{" "}
                          <Tooltip
                            title="Copied"
                            open={showedCopyTooltipIndex === index}
                            onClose={() => setShowewCopyTooltipIndex(-1)}
                          >
                            <IconButton
                              aria-label="Copy submit URL to clipboard"
                              onClick={() => {
                                copy(submitUrl);
                                setShowewCopyTooltipIndex(index);
                              }}
                              disabled={isFetching || !!PENDING}
                            >
                              <CopyContent />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell />
                    )}
                    <TableCell>{notificationsEnabled ? "On" : "Off"}</TableCell>
                    <TableCell>
                      <div className={classes.flexContainer}>
                        <IconButton
                          aria-label="Edit form"
                          onClick={() => startUpdate(_id)}
                          disabled={isFetching || !!PENDING}
                        >
                          <Create />
                        </IconButton>
                        <IconButton
                          aria-label="Delete form"
                          onClick={() => {
                            setSelectedFormId(_id);
                          }}
                          disabled={isFetching || !!PENDING}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </TableCell>
                    {PENDING ? (
                      <LinearProgress className={classes.pendingProgress} />
                    ) : null}
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteFormDialog
        open={!!selectedForm && !selectedForm.PENDING}
        name={selectedForm?.name}
        onConfirmed={() => deleteOne(selectedForm._id)}
        onDismissed={() => setSelectedFormId(null)}
      />
    </>
  );
};

// FormList.whyDidYouRender = true;

export default FormList;
