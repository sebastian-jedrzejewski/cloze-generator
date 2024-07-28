import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../store/AuthContext/AuthContext";

const ProtectedRoute: React.FC<PropsWithChildren> = (props) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return props.children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
