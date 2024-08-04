import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import ErrorMessage from "../../components/UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import DraftClozeTestDetail from "../../components/ClozeTests/DraftClozeTestDetail";

const DraftClozeTestDetailPage = () => {
  const { id } = useParams();
  const {
    data: test,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clozeTests", id],
    queryFn: () => clozeTestsApi.getDraftClozeTestDetail(id),
  });

  let content = null;

  if (isError) {
    content = <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />;
  }

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  if (test) {
    content = <DraftClozeTestDetail test={test} />;
  }

  return (
    <Box sx={{ padding: "2rem", width: "100%", height: "100%" }}>{content}</Box>
  );
};

export default DraftClozeTestDetailPage;
