import { Box, CircularProgress, SxProps, Theme } from "@mui/material";

type CircularProgressColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

type Props = {
  boxSx?: SxProps<Theme>;
  color?: CircularProgressColor;
};

const LoadingSpinner: React.FC<Props> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginY: "2rem",
        ...props.boxSx,
      }}
    >
      <CircularProgress color={props.color || "secondary"} />
    </Box>
  );
};

export default LoadingSpinner;
