import React, { FC } from "react";
import { useIsFetching } from "react-query";
import { LinearProgress } from "@material-ui/core";

import useStyles from "./styles";

const FetchProgress: FC = () => {
  const classes = useStyles();
  const isFetching = useIsFetching();

  if (isFetching) {
    return <LinearProgress className={classes.progress} />;
  }

  return null;
};

export default FetchProgress;
