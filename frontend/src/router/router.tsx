import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AccountCreatedPage from "../pages/Auth/AccountCreatedPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "account-created",
    element: <AccountCreatedPage />,
  },
]);

export default router;
