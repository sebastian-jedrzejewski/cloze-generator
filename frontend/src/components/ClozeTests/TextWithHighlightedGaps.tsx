import { Box } from "@mui/material";

import { Gap } from "../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../constants/colors";
import { ChosenWord } from "./DraftClozeTestDetail";

type Props = {
  text: string;
  chosenGaps: Gap[];
  chosenWord: ChosenWord;
  setChosenWord: (word: ChosenWord | null) => void;
};

const TextWithHighlightedGaps: React.FC<Props> = (props) => {
  const { text, chosenGaps, chosenWord, setChosenWord } = props;

  const getHighlightedText = () => {
    const parts: {
      text: string;
      ghost: boolean;
      highlighted: boolean;
      gap?: Gap;
    }[] = [];
    let lastIndex = 0;

    const gaps = chosenGaps.slice();
    if (chosenWord && chosenWord.entity === "ALTERNATIVE") {
      gaps.push(chosenWord.gap);
      gaps.sort((a, b) => a.start - b.start);
    }

    gaps.forEach((gap) => {
      if (gap.start > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, gap.start),
          highlighted: false,
          ghost: false,
        });
      }
      parts.push({
        text: text.substring(gap.start, gap.end),
        highlighted: true,
        ghost:
          chosenWord?.entity === "ALTERNATIVE"
            ? gap.index === chosenWord?.gap.index
            : false,
        gap,
      });
      lastIndex = gap.end;
    });

    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        highlighted: false,
        ghost: false,
      });
    }

    return parts;
  };

  const parts = getHighlightedText();

  return (
    <Box sx={{ flex: 4, p: 2, textAlign: "justify" }}>
      {parts.map((part, index) => {
        let bgcolor = "transparent";
        if (part.highlighted) {
          bgcolor = COLORS.purple300;
        }
        if (part.ghost) {
          bgcolor = "yellow";
        }
        return (
          <span
            key={index}
            style={{
              backgroundColor: bgcolor,
              cursor: part.highlighted && !part.ghost ? "pointer" : "",
              border:
                part.gap &&
                chosenWord?.gap.index === part?.gap.index &&
                !part.ghost
                  ? "2px solid black"
                  : "none",
              borderRadius: part.highlighted ? "5px" : "",
              padding: part.highlighted ? "2px" : "",
            }}
            onClick={() => {
              if (part.gap && !part.ghost) {
                if (chosenWord && chosenWord.gap.index === part.gap.index) {
                  setChosenWord(null);
                } else {
                  setChosenWord({ gap: part.gap, entity: "GAP" });
                }
              }
            }}
          >
            {part.text}
          </span>
        );
      })}
    </Box>
  );
};

export default TextWithHighlightedGaps;
