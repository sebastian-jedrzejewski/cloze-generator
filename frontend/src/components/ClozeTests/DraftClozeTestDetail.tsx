import { useEffect, useState } from "react";
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

type Props = {
  test: DraftClozeTestDetailDTO;
};

const DraftClozeTestDetail: React.FC<Props> = (props) => {
  const [chosenGaps, setChosenGaps] = useState<Gap[]>([]);
  const test = props.test;

  useEffect(() => {
    const gaps = test.gaps.predictedGaps;
    const sortedGaps = gaps.slice().sort((a, b) => a.start - b.start);
    setChosenGaps(sortedGaps);
  }, [test.gaps.predictedGaps]);

  return (
    <Box sx={{ width: "90%", ml: "auto", mr: "auto", textAlign: "center" }}>
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
          <Button color="info" variant="text">
            How it works
          </Button>
        </Box>
        <Box sx={{ display: "flex", columnGap: 2 }}>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<AddIcon />}
            disabled
          >
            Add gap
          </Button>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<RemoveIcon />}
            disabled
          >
            Remove gap
          </Button>
          <Button color="error" variant="contained" startIcon={<DeleteIcon />}>
            Delete
          </Button>
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
        />
        <AlternativeList alternatives={test.gaps.alternatives} />
      </Box>
      <Button color="secondary" variant="contained" startIcon={<SaveIcon />}>
        Save test
      </Button>
    </Box>
  );
};

export default DraftClozeTestDetail;
