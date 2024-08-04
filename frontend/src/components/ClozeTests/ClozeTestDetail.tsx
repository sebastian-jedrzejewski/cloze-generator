import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";

import { ClozeTestDetailDTO } from "../../config/api/clozeTests/clozeTests.types";
import { sanitize } from "../Utils/SanitizeHTML";
import COLORS from "../../constants/colors";
import AlertDialog from "../Layout/AlertDialog";
import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import ErrorMessage from "../UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import LoadingSpinner from "../UI/LoadingSpinner";
import { queryClient } from "../../config/api";

type Props = {
  test: ClozeTestDetailDTO;
};

const ClozeTestDetail: React.FC<Props> = (props) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    mutate: deleteTest,
    isPending,
    isError,
  } = useMutation({
    mutationFn: clozeTestsApi.deleteClozeTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
      navigate("/");
    },
  });

  const deleteTestHandler = () => {
    deleteTest(props.test.id + "");
    setIsDeleteDialogOpen(false);
  };

  if (!Array.isArray(props.test.gaps)) {
    return null;
  }

  return (
    <Box
      sx={{
        marginBottom: "2.5rem",
        width: "70%",
        textAlign: "center",
        ml: "auto",
        mr: "auto",
      }}
    >
      {isError && <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />}
      {isPending && <LoadingSpinner />}
      {!isPending && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            my: "1rem",
            columnGap: 2,
          }}
        >
          <Button color="secondary" startIcon={<PrintIcon />}>
            Print
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      )}
      <Typography variant="h3" sx={{ mb: "1.1rem" }}>
        {props.test.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "justify", mt: "0.5rem", fontSize: "1.2rem" }}
        dangerouslySetInnerHTML={{
          __html: sanitize({ html: props.test.textWithGaps }),
        }}
      ></Typography>
      <Box sx={{ mt: "2rem" }}>
        <Accordion sx={{ bgcolor: COLORS.gray300 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="answers-content"
            id="answers-header"
          >
            Answers
          </AccordionSummary>
          <AccordionDetails sx={{ py: 0 }}>
            <List>
              {props.test.gaps.map((gap, index) => (
                <ListItem disablePadding key={gap.index}>
                  <ListItemButton>
                    <ListItemText>
                      {index + 1}. {gap.word}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
      <AlertDialog
        agreeButton={
          <Button color="error" variant="contained" onClick={deleteTestHandler}>
            Delete
          </Button>
        }
        cancelButtonText="Cancel"
        closeHandler={() => setIsDeleteDialogOpen(false)}
        isOpen={isDeleteDialogOpen}
        title="Delete Open Cloze Test"
        contentText="Are you sure you want to delete this open cloze test? This action is irreversible."
      />
    </Box>
  );
};

export default ClozeTestDetail;
