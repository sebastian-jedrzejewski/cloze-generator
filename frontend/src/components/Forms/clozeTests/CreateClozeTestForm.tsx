import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import MESSAGES from "../../../constants/messages";
import Input from "../common/Input";
import clozeTestsApi from "../../../config/api/clozeTests/clozeTests";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorMessage from "../../UI/ErrorMessage";
import { startPolling } from "../../../store/redux/slices/polling-slice";
import { AppDispatch, RootState } from "../../../store/redux";
import { useSelector } from "react-redux";

const CreateClozeTestForm = () => {
  const isPollingLoading = useSelector(
    (state: RootState) => state.polling.loading,
  );
  const pollingError = useSelector((state: RootState) => state.polling.error);
  const dispatch: AppDispatch = useDispatch();
  const {
    mutate: createClozeTest,
    isPending: isCreatingLoading,
    isError: isCreatingError,
  } = useMutation({
    mutationFn: clozeTestsApi.createClozeTest,
    onSuccess: (response) => {
      formik.resetForm();
      dispatch(startPolling(response.taskId));
    },
  });

  const formik = useFormik({
    initialValues: { title: "", text: "", numberOfGaps: 8 },
    validationSchema: Yup.object({
      text: Yup.string().required(MESSAGES.FIELD_REQUIRED),
      numberOfGaps: Yup.number()
        .min(1, "Number of gaps must be greater than or equal to 1")
        .max(12, "Number of gaps must be less than or equal to 12")
        .required(MESSAGES.FIELD_REQUIRED),
    }),
    onSubmit: (values) => {
      createClozeTest(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <Input
        id="title"
        label={"Title"}
        formik={formik}
        sx={{ width: { xs: "100%", md: "80%", lg: "60%" } }}
        maxLength={128}
      />
      <Input
        id="text"
        label={"Text*"}
        formik={formik}
        sx={{
          width: { xs: "100%", md: "80%", lg: "60%" },
        }}
        multiline
        minRows={8}
        maxRows={16}
        maxLength={2048}
      />
      <Input
        id="numberOfGaps"
        label={"Number of gaps"}
        formik={formik}
        sx={{ width: { xs: "30%", md: "20%", lg: "10%" } }}
        inputProps={{ type: "number", min: 1, max: 12 }}
      />
      {(isCreatingLoading || isPollingLoading) && (
        <Box>
          <LoadingSpinner boxSx={{ mt: "1rem", mb: "0.5rem" }} />
          <Typography>
            Generating your test by our model... You can safely leave this page.
          </Typography>
        </Box>
      )}
      {!isCreatingLoading && !isPollingLoading && (
        <Button
          sx={{
            mt: "0.5rem",
            width: { xs: "100%", md: "80%", lg: "60%" },
            my: "1rem",
          }}
          variant="contained"
          color="secondary"
          type="submit"
        >
          {"Generate test with gaps"}
        </Button>
      )}
      {isCreatingError && (
        <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />
      )}
      {pollingError && <ErrorMessage message={pollingError} />}
    </Box>
  );
};

export default CreateClozeTestForm;
