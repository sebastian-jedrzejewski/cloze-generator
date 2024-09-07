import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";

import ErrorMessage from "../../components/UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import SolveClozeTestForm from "../../components/Forms/clozeTests/SolveClozeTestForm";
import TestNotFoundError from "../../components/UI/TestNotFoundError";

const SolveOwnTestPage = () => {
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
      content = <TestNotFoundError />;
    } else {
      content = <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />;
    }
  }

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  if (test) {
    content = <SolveClozeTestForm test={test} />;
  }

  return (
    <Box sx={{ padding: "2rem", width: "100%", height: "100%" }}>{content}</Box>
  );
};

export default SolveOwnTestPage;
