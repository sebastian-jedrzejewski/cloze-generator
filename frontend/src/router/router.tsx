import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

export default router;
