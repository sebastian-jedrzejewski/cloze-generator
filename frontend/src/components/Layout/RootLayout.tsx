import { useEffect } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Navbar from "./Navbar";
import COLORS from "../../constants/colors";
import { AppDispatch, RootState } from "../../store/redux";
import { queryClient } from "../../config/api";
import { resetState } from "../../store/redux/slices/polling-slice";
import { hide, show } from "../../store/redux/slices/snackbar-slice";
import MessageSnackbar from "../UI/MessageSnackbar";

const RootLayout = () => {
  const { result: pollingResult, error: pollingError } = useSelector(
    (state: RootState) => state.polling,
  );
  const { isSnackbarVisible, message, severity } = useSelector(
    (state: RootState) => state.snackbar,
  );
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pollingResult) {
      queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
      if (location.pathname === "/cloze-tests/generate") {
        navigate(`/cloze-tests/drafts/${pollingResult}`);
      }
      dispatch(resetState());
      dispatch(
        show({ message: "The cloze test has been generated successfully!" }),
      );
    } else if (pollingError) {
      dispatch(show({ message: pollingError, severity: "error" }));
      dispatch(resetState());
    }
  }, [pollingResult, pollingError]);

  const hideSnackbar = () => {
    dispatch(hide());
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: COLORS.gray200,
            color: COLORS.black200,
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
        <MessageSnackbar
          message={message}
          open={isSnackbarVisible}
          severity={severity}
          onClose={hideSnackbar}
        />
      </Box>
    </>
  );
};

export default RootLayout;
