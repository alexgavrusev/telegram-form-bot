import { makeStyles } from "@material-ui/core/styles";

import theme from "theme";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  paper: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  justifySelfEnd: {
    justifySelf: "flex-end",
  },
  container: {
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
  buttonContainer: {
    alignItems: "flex-start",
    [theme.breakpoints.up("sm")]: {
      alignItems: "flex-end",
    },
  },
});

export default useStyles;
