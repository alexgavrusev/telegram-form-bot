import { useRef } from "react";

const useStaleValue = <T>(currentValue: T, shouldUpdate: boolean) => {
  const ref = useRef(currentValue);

  if (shouldUpdate) {
    ref.current = currentValue;
  }

  return ref.current;
};

export default useStaleValue;
