import { Box, Typography } from "@mui/material";
import React from "react";

import { ClozeTestDetailDTO } from "../../config/api/clozeTests/clozeTests.types";
import { sanitize } from "../Utils/SanitizeHTML";

type Props = {
  test: ClozeTestDetailDTO;
};

const ClozeTestToPrint = React.forwardRef((props: Props, ref) => {
  return (
    <Box ref={ref} sx={{ display: "none", displayPrint: "block", p: 4 }}>
      <Typography sx={{ mb: "2rem" }}>
        For questions {`1-${props.test.gaps.length}`}, read the text below and
        think of the word which best fits each gap. Use only{" "}
        <strong>one</strong> word in each gap.
      </Typography>
      <Typography
        variant="h4"
        sx={{ mb: "1rem", textAlign: "center", fontWeight: "bold" }}
      >
        {props.test.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "justify", mt: "2rem", fontSize: "1.2rem" }}
        dangerouslySetInnerHTML={{
          __html: sanitize({
            html: props.test.textWithGaps.replaceAll("#9C27B0", "#000"),
          }),
        }}
      ></Typography>
    </Box>
  );
});

export default ClozeTestToPrint;
