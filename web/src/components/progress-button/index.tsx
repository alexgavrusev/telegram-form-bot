import React, { forwardRef } from "react";
import { Button, CircularProgress, ButtonProps } from "@material-ui/core";

import useStyles from "./styles";

type Props = ButtonProps & {
  loading: boolean;
  // TODO: fix type
  component?: unknown;
};

const ProgressButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading, children, startIcon, endIcon, ...props }, ref) => {
    const classes = useStyles();

    const centerSpinner = (
      <CircularProgress className={classes.centerSpinner} size={24} />
    );

    const startOrEndSpinner = <CircularProgress size={20} />;

    const showCenterSpinner = !startIcon && !endIcon && loading;

    return (
      <Button
        ref={ref}
        className={classes.button}
        variant="contained"
        color="primary"
        startIcon={startIcon && loading ? startOrEndSpinner : startIcon}
        endIcon={endIcon && loading ? startOrEndSpinner : endIcon}
        {...props}
      >
        <span className={showCenterSpinner ? classes.zeroOpacity : null}>
          {children}
        </span>
        {showCenterSpinner ? centerSpinner : null}
      </Button>
    );
  }
);

export default ProgressButton;
