import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ClozeTestDetailDTO } from "../../config/api/clozeTests/clozeTests.types";
import SanitizeHTML from "../Utils/SanitizeHTML";
import COLORS from "../../constants/colors";

type Props = {
  test: ClozeTestDetailDTO;
};

const ClozeTestDetail: React.FC<Props> = (props) => {
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
      <Typography variant="h3" sx={{ mb: "1.1rem" }}>
        {props.test.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: "justify", mt: "0.5rem", fontSize: "1.2rem" }}
      >
        <SanitizeHTML html={props.test.textWithGaps} />
      </Typography>
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
    </Box>
  );
};

export default ClozeTestDetail;
