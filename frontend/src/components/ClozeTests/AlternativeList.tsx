import {
  Box,
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
};

const AlternativeList: React.FC<Props> = (props) => {
  const { alternatives, chosenWord, setChosenWord } = props;

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: COLORS.gray300,
        borderLeft: { xs: "none", sm: `2px solid ${COLORS.gray500}` },
        borderTop: { xs: `2px solid ${COLORS.gray500}`, sm: "none" },
      }}
    >
      <List>
        {alternatives.length === 0 && (
          <Typography>No alternatives available</Typography>
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
