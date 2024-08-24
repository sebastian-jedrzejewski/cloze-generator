import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import ErrorMessage from "../../components/UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import ClozeTestDetail from "../../components/ClozeTests/ClozeTestDetail";
import { isAxiosError } from "axios";

const ClozeTestDetailPage = () => {
  const { id } = useParams();
  const {
    data: test,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clozeTests", id],
    queryFn: () => clozeTestsApi.getClozeTestDetail(id),
    retry: 1,
  });

  let content = null;

  if (isError) {
    if (isAxiosError(error) && error.response?.status === 404) {
      content = (
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
    } else {
      content = <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />;
    }
  }

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  if (test) {
    content = <ClozeTestDetail test={test} />;
  }

  return (
    <Box sx={{ padding: "2rem", width: "100%", height: "100%" }}>{content}</Box>
  );
};

export default ClozeTestDetailPage;
