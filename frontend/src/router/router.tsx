import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AccountCreatedPage from "../pages/Auth/AccountCreatedPage";
import ProtectedRoute from "./ProtectedRoute";
import ForNotAuthenticatedRoute from "./ForNotAuthenticatedRoute";
import RootLayout from "../components/Layout/RootLayout";
import MainPage from "../pages/MainPage";
import ClozeTestDetailPage from "../pages/ClozeTests/ClozeTestDetailPage";
import DraftClozeTestDetailPage from "../pages/ClozeTests/DraftClozeTestDetailPage";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MainPage /> },
      { path: "cloze-tests/:id", element: <ClozeTestDetailPage /> },
      { path: "cloze-tests/drafts/:id", element: <DraftClozeTestDetailPage /> },
    ],
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
