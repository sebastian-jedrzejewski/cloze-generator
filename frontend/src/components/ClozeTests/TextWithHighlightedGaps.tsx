import { Box } from "@mui/material";

import { Gap } from "../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../constants/colors";

type Props = {
  text: string;
  chosenGaps: Gap[];
};

const TextWithHighlightedGaps: React.FC<Props> = (props) => {
  const { text, chosenGaps } = props;

  const getHighlightedText = () => {
    const parts = [];
    let lastIndex = 0;

    chosenGaps.forEach(({ start, end }) => {
      if (start > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, start),
          highlighted: false,
        });
      }
      parts.push({ text: text.substring(start, end), highlighted: true });
      lastIndex = end;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), highlighted: false });
    }

    return parts;
  };

  const parts = getHighlightedText();

  return (
    <Box sx={{ flex: 4, p: 2, textAlign: "justify" }}>
      {parts.map((part, index) => (
        <span
          key={index}
          style={{
            backgroundColor: part.highlighted
              ? COLORS.purple300
              : "transparent",
          }}
        >
          {part.text}
        </span>
      ))}
    </Box>
  );
};

export default TextWithHighlightedGaps;
