import React from "react";
import { CircularProgress } from "@material-ui/core";

import useStyles from "./styles";

const GlobalSpinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} size={64} />
    </div>
  );
};

export default GlobalSpinner;
