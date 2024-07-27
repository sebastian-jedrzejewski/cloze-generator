import { Link } from "react-router-dom";
import { Box } from "@mui/material";

import AuthCard from "../../components/UI/AuthCard";

const AccountCreatedPage = () => {
  return (
    <AuthCard>
      <Box
        sx={{
          my: "3.5rem",
          px: "0.2rem",
          fontSize: "1.4rem",
          color: "#242424",
        }}
      >
        Your account has been created successfully. Now you can{" "}
        <Link to="/login">login</Link>
      </Box>
    </AuthCard>
  );
};

export default AccountCreatedPage;
