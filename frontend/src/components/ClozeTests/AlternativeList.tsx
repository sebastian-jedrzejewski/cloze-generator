import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import { Gap } from "../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../constants/colors";
import { ChosenWord } from "./DraftClozeTestDetail";

type Props = {
  alternatives: Gap[];
  chosenWord: ChosenWord;
  setChosenWord: (word: ChosenWord | null) => void;
  alternativesMarked: boolean;
  setAlternativesMarked: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlternativeList: React.FC<Props> = (props) => {
  const {
    alternatives,
    chosenWord,
    setChosenWord,
    alternativesMarked,
    setAlternativesMarked,
  } = props;

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: COLORS.gray300,
        borderLeft: `2px solid ${COLORS.gray500}`,
      }}
    >
      <List>
        {alternatives.length === 0 && (
          <Typography>No alternatives available</Typography>
        )}
        {alternatives.length > 0 && (
          <Button
            color="info"
            onClick={() => setAlternativesMarked((prevState) => !prevState)}
          >
            {alternativesMarked ? "Unmark all" : "Mark all"}
          </Button>
        )}
        {alternatives.map((gap) => (
          <ListItem key={gap.index} disablePadding>
            <ListItemButton
              onClick={() => {
                if (chosenWord && chosenWord.gap.index === gap.index) {
                  if (!chosenWord.hovered) {
                    setChosenWord(null);
                  } else {
                    setChosenWord({ ...chosenWord, hovered: false });
                  }
                } else {
                  setChosenWord({ gap: gap, entity: "ALTERNATIVE" });
                }
              }}
              selected={
                chosenWord !== null && chosenWord.gap.index === gap.index
              }
              onMouseEnter={() => {
                if (chosenWord && !chosenWord.hovered) return;
                setChosenWord({
                  gap: gap,
                  entity: "ALTERNATIVE",
                  hovered: true,
                });
              }}
              onMouseLeave={() => {
                if (chosenWord && !chosenWord.hovered) return;
                setChosenWord(null);
              }}
            >
              <ListItemText>{gap.word}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AlternativeList;
