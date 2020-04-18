import { makeStyles } from "@material-ui/core/styles";

import theme from "theme";

const useStyles = makeStyles({
  gridContainer: {
    // 1 for negative margin + 1 for 1st child spacing
    paddingTop: theme.spacing(2),
  },
  formListContainer: {
    // prevent overflow
    width: "100%",
  },
});

export default useStyles;
