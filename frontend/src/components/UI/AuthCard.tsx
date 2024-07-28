import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

import logo from "../../assets/vite.svg";
import COLORS from "../../constants/colors";

const AuthCard: React.FC<PropsWithChildren> = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: COLORS.gray200,
        width: { xs: "100%", md: "50%", lg: "30%" },
        borderRadius: "10px",
        boxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
        WebkitBoxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
        textAlign: "center",
        padding: "10px",
        zIndex: 1,
        color: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "1rem",
          columnGap: 2,
        }}
      >
        <Box component="img" src={logo} width="15%"></Box>
        <Box sx={{ fontSize: "1.3rem", letterSpacing: 2, color: "#5e5d5d" }}>
          Cloze Generator
        </Box>
      </Box>
      {props.children}
    </Box>
  );
};

export default AuthCard;
