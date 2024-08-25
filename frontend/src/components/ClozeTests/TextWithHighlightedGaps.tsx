import { Box } from "@mui/material";

import { Gap } from "../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../constants/colors";
import { ChosenWord } from "./DraftClozeTestDetail";

type Props = {
  text: string;
  chosenGaps: Gap[];
  chosenWord: ChosenWord;
  setChosenWord: (word: ChosenWord | null) => void;
  alternativesMarked: boolean;
  alternatives: Gap[];
};

const TextWithHighlightedGaps: React.FC<Props> = (props) => {
  const {
    text,
    chosenGaps,
    chosenWord,
    setChosenWord,
    alternativesMarked,
    alternatives,
  } = props;

  const getHighlightedText = () => {
    const parts: {
      text: string;
      ghost: boolean;
      highlighted: boolean;
      gap?: Gap;
    }[] = [];
    let lastIndex = 0;

    let gaps = chosenGaps.slice();
    let alternativeIds: number[] = [];
    if (alternativesMarked) {
      gaps = gaps.concat(alternatives);
      alternativeIds = alternatives.map((gap) => gap.index);
      gaps.sort((a, b) => a.start - b.start);
    } else if (chosenWord && chosenWord.entity === "ALTERNATIVE") {
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
      let isGhost = false;
      if (alternativesMarked) {
        isGhost = alternativeIds.includes(gap.index);
      } else if (chosenWord?.entity === "ALTERNATIVE") {
        isGhost = gap.index === chosenWord?.gap.index;
      }
      parts.push({
        text: text.substring(gap.start, gap.end),
        highlighted: true,
        ghost: isGhost,
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
        let border = "none";
        if (part.gap && chosenWord?.gap.index === part?.gap.index) {
          if (part.ghost) {
            border = alternativesMarked ? "2px solid black" : "none";
          } else {
            border = "2px solid black";
          }
        }
        return (
          <span
            key={index}
            style={{
              backgroundColor: bgcolor,
              cursor: part.highlighted && !part.ghost ? "pointer" : "",
              border,
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
