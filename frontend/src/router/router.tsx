import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AccountCreatedPage from "../pages/Auth/AccountCreatedPage";
import ForNotAuthenticatedRoute from "./ForNotAuthenticatedRoute";
import RootLayout from "../components/Layout/RootLayout";
import MainPage from "../pages/MainPage";
import ClozeTestDetailPage from "../pages/ClozeTests/ClozeTestDetailPage";
import DraftClozeTestDetailPage from "../pages/ClozeTests/DraftClozeTestDetailPage";
import CreateClozeTestPage from "../pages/ClozeTests/CreateClozeTestPage";
import SolveOwnTestPage from "../pages/ClozeTests/SolveOwnTestPage";
import SolveSharedTestPage from "../pages/ClozeTests/SolveSharedTestPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "cloze-tests/generate", element: <CreateClozeTestPage /> },
      { path: "cloze-tests/:id", element: <ClozeTestDetailPage /> },
      { path: "cloze-tests/drafts/:id", element: <DraftClozeTestDetailPage /> },
      { path: "cloze-tests/solve/:id", element: <SolveOwnTestPage /> },
      { path: "cloze-tests/solve/", element: <SolveSharedTestPage /> },
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
    ],
  },
]);

export default router;
