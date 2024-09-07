import { Box, Typography } from "@mui/material";

const TestNotFoundError = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "red",
      }}
    >
      <Typography variant="h4">The test wasn't found!</Typography>
    </Box>
  );
};

export default TestNotFoundError;
