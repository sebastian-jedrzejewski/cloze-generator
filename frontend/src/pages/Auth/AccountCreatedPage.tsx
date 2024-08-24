import { Link } from "react-router-dom";
import { Box } from "@mui/material";

import AuthCard from "../../components/UI/AuthCard";
import COLORS from "../../constants/colors";

const AccountCreatedPage = () => {
  return (
    <AuthCard>
      <Box
        sx={{
          my: "3.5rem",
          px: "0.2rem",
          fontSize: "1.4rem",
          color: COLORS.black200,
        }}
      >
        Your account has been created successfully. Now you can{" "}
        <Link to="/login">login</Link>
      </Box>
    </AuthCard>
  );
};

export default AccountCreatedPage;
