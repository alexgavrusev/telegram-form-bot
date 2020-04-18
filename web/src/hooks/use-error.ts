import { useContext } from "react";
import errorContext from "context/error-context";

const useError = () => useContext(errorContext);

export default useError;
