import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AccountCreatedPage from "../pages/Auth/AccountCreatedPage";
import ProtectedRoute from "./ProtectedRoute";
import ForNotAuthenticatedRoute from "./ForNotAuthenticatedRoute";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "login",
    element: (
      <ForNotAuthenticatedRoute>
        <LoginPage />
      </ForNotAuthenticatedRoute>
    ),
  },
  {
    path: "register",
    element: (
      <ForNotAuthenticatedRoute>
        <RegisterPage />
      </ForNotAuthenticatedRoute>
    ),
  },
  {
    path: "account-created",
    element: (
      <ForNotAuthenticatedRoute>
        <AccountCreatedPage />
      </ForNotAuthenticatedRoute>
    ),
  },
]);

export default router;
