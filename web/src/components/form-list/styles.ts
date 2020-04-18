import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  itemRow: {
    // HACK: can't apply position relative to tr
    transform: "scale(1)",
  },
  flexContainer: {
    display: "flex",
  },
  pendingItem: {
    opacity: 0.5,
  },
  pendingProgress: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
  },
  // Prevent wrapping
  submitUrlContainer: {
    display: "flex",
    alignItems: "center",
  },
});

export default useStyles;
