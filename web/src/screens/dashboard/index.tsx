import React, { FC, Suspense } from "react";
import { Grid, Container } from "@material-ui/core";

import LogoutButton from "components/logout-button";
import FormList, { FormListSkeleton } from "components/form-list";
import NewFormButton, {
  NewFormButtonSkeleton,
} from "components/new-form-button";
import ActionDrawer from "components/action-drawer";
import LinkTelegramBanner from "components/link-telegram-banner";

import useStyles from "./styles";

const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <>
      <LinkTelegramBanner />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          direction="column"
          className={classes.gridContainer}
        >
          <Grid item>
            <LogoutButton />
          </Grid>

          <Suspense
            fallback={
              <>
                <Grid item>
                  <FormListSkeleton />
                </Grid>
                <Grid item>
                  <NewFormButtonSkeleton />
                </Grid>
              </>
            }
          >
            <Grid item className={classes.formListContainer}>
              <FormList />
            </Grid>

            <Grid item>
              <NewFormButton />
            </Grid>
          </Suspense>
        </Grid>
      </Container>

      <Suspense fallback={null}>
        <ActionDrawer />
      </Suspense>
    </>
  );
};
// Dashboard.whyDidYouRender = true;

export default Dashboard;
