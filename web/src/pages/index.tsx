import React, { FC, lazy } from "react";

import useAuthRouting from "hooks/use-auth-routing";

import prefetchForms from "utils/prefetch-forms";

const Dashboard = lazy(() => {
  prefetchForms();
  return import("screens/dashboard");
});
const Login = lazy(() => import("screens/login"));

const Index: FC = () => {
  const isAuthenticated = useAuthRouting({
    authRoute: "/dashboard",
    unauthRoute: "/login",
  });

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <Login />;
};

export default Index;
