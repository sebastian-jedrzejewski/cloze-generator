import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

const AuthCard: React.FC<PropsWithChildren> = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: "#ccc",
        width: { xs: "100%", md: "50%", lg: "35%" },
        borderRadius: "10px",
        boxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
        WebkitBoxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
        textAlign: "center",
        padding: "10px",
        zIndex: 1,
        color: "#000",
      }}
    >
      {props.children}
    </Box>
  );
};

export default AuthCard;
