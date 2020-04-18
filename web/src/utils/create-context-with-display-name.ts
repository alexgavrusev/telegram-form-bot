import { createContext } from "react";

const createContextWithDisplayName = <T>(displayName: string) => {
  const context = createContext<T>(undefined);
  context.displayName = displayName;

  return context;
};

export default createContextWithDisplayName;
