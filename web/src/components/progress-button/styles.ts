import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  button: {
    position: "relative",
  },
  centerSpinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  zeroOpacity: {
    opacity: 0,
  },
});

export default useStyles;
