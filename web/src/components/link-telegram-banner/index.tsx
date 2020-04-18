import React, { FC } from "react";
import { Paper, Container, Grid, Typography, Avatar } from "@material-ui/core";
import { SmsFailed } from "@material-ui/icons";

import ProgressButton from "components/progress-button";

import useUser from "hooks/use-user";
import useUserActions from "hooks/use-user-actions";

import useStyles from "./styles";

const LinkTelegramBanner: FC = () => {
  const classes = useStyles();

  const { telegramId, isFetching } = useUser();
  const {
    linkTelegramMutation: [linkTelegram, { isIdle, isLoading }],
  } = useUserActions();

  if (telegramId) {
    // Already linked
    return null;
  }

  return (
    <Paper elevation={0} className={classes.paper}>
      <Container maxWidth="sm">
        <Grid container className={classes.container}>
          <Grid
            item
            xs={12}
            sm="auto"
            container
            wrap="nowrap"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Avatar className={classes.avatar}>
                <SmsFailed />
              </Avatar>
            </Grid>

            <Grid item>
              <Typography>
                Linking Telegram is required to receive notifications.
              </Typography>
            </Grid>
          </Grid>

          {/* Auto can't be used because 100% width on container */}
          <Grid
            item
            xs={12}
            sm="auto"
            container
            justify="flex-end"
            className={classes.buttonContainer}
          >
            <Grid item>
              <ProgressButton
                onClick={() => linkTelegram()}
                disabled={!isIdle || isFetching}
                loading={isLoading}
                variant="text"
                color="primary"
              >
                Link telegram
              </ProgressButton>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default LinkTelegramBanner;
