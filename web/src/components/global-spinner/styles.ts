import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -32,
    marginLeft: -32,
  },
});

export default useStyles;
