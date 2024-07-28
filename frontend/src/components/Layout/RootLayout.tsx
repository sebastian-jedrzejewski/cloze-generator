import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import COLORS from "../../constants/colors";

const RootLayout = () => {
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
      </Box>
    </>
  );
};

export default RootLayout;
