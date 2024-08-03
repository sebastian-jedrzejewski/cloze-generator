import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

const FullPageWrapper: React.FC<PropsWithChildren> = (props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.children}
    </Box>
  );
};

export default FullPageWrapper;
