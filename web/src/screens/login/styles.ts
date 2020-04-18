import { makeStyles } from "@material-ui/core/styles";

import theme from "theme";

const useStyles = makeStyles({
  container: {
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
});

export default useStyles;
