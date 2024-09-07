import React, { useContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShareIcon from "@mui/icons-material/Share";

import { ClozeTestDetailDTO } from "../../config/api/clozeTests/clozeTests.types";
import { sanitize } from "../Utils/SanitizeHTML";
import COLORS from "../../constants/colors";
import AlertDialog from "../Layout/AlertDialog";
import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import ErrorMessage from "../UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import LoadingSpinner from "../UI/LoadingSpinner";
import { queryClient } from "../../config/api";
import ClozeTestToPrint from "./ClozeTestToPrint";
import { AuthContext } from "../../store/AuthContext/AuthContext";
import ShareTestPopoverForm from "../Forms/clozeTests/ShareTestPopoverForm";

type Props = {
  test: ClozeTestDetailDTO;
};

const ClozeTestDetail: React.FC<Props> = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const navigate = useNavigate();
  const contentToPrint = useRef(null);

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

  const handlePrint = useReactToPrint({
    documentTitle:
      props.test.title?.replace(new RegExp(" ", "g"), "-") ||
      props.test.shortTitle?.replace(new RegExp(" ", "g"), "-"),
    removeAfterPrint: true,
    content: () => contentToPrint.current,
  });

  const deleteTestHandler = () => {
    deleteTest(props.test.id + "");
    setIsDeleteDialogOpen(false);
  };

  const handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
            justifyContent: { xs: "center", lg: "flex-end" },
            alignItems: "center",
            my: "1rem",
            columnGap: 2,
            flexWrap: "wrap",
            rowGap: 1,
          }}
        >
          <Button
            color="secondary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            color="secondary"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate(`/cloze-tests/solve/${props.test.id}/`)}
          >
            Solve
          </Button>
          <Tooltip
            title="Share the link with other users to allow them to solve your test"
            placement="top"
            arrow
          >
            <Button
              color="secondary"
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share
            </Button>
          </Tooltip>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
          <ShareTestPopoverForm
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            test={props.test}
          />
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
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mt: "1.5rem" }}>
          This test will be deleted after some time. Make sure you saved it in a
          safe place or login to save tests permanently.
        </Alert>
      )}
      <Box sx={{ display: "none" }}>
        <ClozeTestToPrint ref={contentToPrint} test={props.test} />
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
