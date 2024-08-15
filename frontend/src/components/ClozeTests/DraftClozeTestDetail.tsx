import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import {
  DraftClozeTestDetailDTO,
  Gap,
} from "../../config/api/clozeTests/clozeTests.types";
import TextWithHighlightedGaps from "./TextWithHighlightedGaps";
import AlternativeList from "./AlternativeList";
import COLORS from "../../constants/colors";
import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import { queryClient } from "../../config/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorMessage from "../UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import AlertDialog from "../Layout/AlertDialog";
import HelpModal from "../UI/HelpModal";

export type ChosenWord = {
  gap: Gap;
  entity: "GAP" | "ALTERNATIVE";
  hovered?: boolean;
} | null;

type Props = {
  test: DraftClozeTestDetailDTO;
};

const DraftClozeTestDetail: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [chosenGaps, setChosenGaps] = useState<Gap[]>([]);
  const [remainingAlternatives, setRemainingAlternatives] = useState<Gap[]>([]);
  const [chosenWord, setChosenWord] = useState<ChosenWord>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const { mutate: saveGaps } = useMutation({
    mutationFn: clozeTestsApi.saveClozeTestGaps,
  });
  const {
    mutate: saveTest,
    isPending: isSavingPending,
    isError: isSavingError,
  } = useMutation({
    mutationFn: clozeTestsApi.saveClozeTest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clozeTests", data.id + ""] });
      queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
      navigate(`/cloze-tests/${data.id}`);
    },
  });
  const {
    mutate: deleteTest,
    isPending: isDeletingPending,
    isError: isDeletingError,
  } = useMutation({
    mutationFn: clozeTestsApi.deleteClozeTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clozeTests"] });
      navigate("/");
    },
  });

  const test = props.test;

  useEffect(() => {
    const gaps = test.gaps.predictedGaps;
    const sortedGaps = gaps.slice().sort((a, b) => a.start - b.start);
    const alternatives = test.gaps.alternatives;
    const sortedAlternatives = alternatives
      .slice()
      .sort((a, b) => a.start - b.start);

    setChosenGaps(sortedGaps);
    setRemainingAlternatives(sortedAlternatives);
  }, [test.gaps.predictedGaps, test.gaps.alternatives]);

  const removeGapHandler = () => {
    if (chosenWord && chosenWord.entity === "GAP") {
      const newChosenGaps = chosenGaps.filter(
        (gap) => gap.index !== chosenWord.gap.index,
      );
      const newAlternatives = [...remainingAlternatives, chosenWord.gap];

      setChosenGaps(newChosenGaps);
      setRemainingAlternatives(newAlternatives);
      setChosenWord(null);
      saveGaps({
        id: test.id + "",
        gaps: { predictedGaps: newChosenGaps, alternatives: newAlternatives },
      });
    }
  };

  const addGapHandler = () => {
    if (chosenWord && chosenWord.entity === "ALTERNATIVE") {
      const newChosenGaps = [...chosenGaps, chosenWord.gap];
      newChosenGaps.sort((a, b) => a.start - b.start);
      const newAlternatives = remainingAlternatives.filter(
        (gap) => gap.index !== chosenWord.gap.index,
      );

      setChosenGaps(newChosenGaps);
      setRemainingAlternatives(newAlternatives);
      setChosenWord(null);
      saveGaps({
        id: test.id + "",
        gaps: { predictedGaps: newChosenGaps, alternatives: newAlternatives },
      });
    }
  };

  const saveTestHandler = () => {
    saveTest(test.id + "");
  };

  const deleteTestHandler = () => {
    deleteTest(test.id + "");
    setIsDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ width: "90%", ml: "auto", mr: "auto", textAlign: "center" }}>
      {isDeletingError && (
        <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: "1rem",
          rowGap: 1,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Button
            color="info"
            variant="text"
            onClick={() => setIsHelpModalOpen(true)}
          >
            How it works
          </Button>
        </Box>
        <Box sx={{ display: "flex", columnGap: 2 }}>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addGapHandler}
            disabled={
              !(
                chosenWord !== null &&
                chosenWord.entity == "ALTERNATIVE" &&
                !chosenWord.hovered
              )
            }
          >
            Add gap
          </Button>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<RemoveIcon />}
            onClick={removeGapHandler}
            disabled={!(chosenWord !== null && chosenWord.entity == "GAP")}
          >
            Remove gap
          </Button>
          {isDeletingPending && <LoadingSpinner />}
          {!isDeletingPending && (
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
      <Typography variant="h3" sx={{ mb: "1.1rem", textAlign: "center" }}>
        {props.test.title}
      </Typography>
      <Box
        sx={{
          ml: "auto",
          mr: "auto",
          mb: "2.5rem",
          display: "flex",
          border: `2px solid ${COLORS.gray500}`,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextWithHighlightedGaps
          text={test.textWithGaps}
          chosenGaps={chosenGaps}
          chosenWord={chosenWord}
          setChosenWord={setChosenWord}
        />
        <AlternativeList
          alternatives={remainingAlternatives}
          chosenWord={chosenWord}
          setChosenWord={setChosenWord}
        />
      </Box>
      {isSavingPending && <LoadingSpinner />}
      {!isSavingPending && (
        <Button
          color="secondary"
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={saveTestHandler}
        >
          Save test
        </Button>
      )}
      {isSavingError && (
        <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />
      )}
      <AlertDialog
        agreeButton={
          <Button color="error" variant="contained" onClick={deleteTestHandler}>
            Delete
          </Button>
        }
        cancelButtonText="Cancel"
        closeHandler={() => setIsDeleteDialogOpen(false)}
        isOpen={isDeleteDialogOpen}
        title="Delete Open Cloze Test (Draft)"
        contentText="Are you sure you want to delete this open cloze test draft? This action is irreversible."
      />
      <HelpModal
        open={isHelpModalOpen}
        handleClose={() => {
          setIsHelpModalOpen(false);
        }}
      />
    </Box>
  );
};

export default DraftClozeTestDetail;
