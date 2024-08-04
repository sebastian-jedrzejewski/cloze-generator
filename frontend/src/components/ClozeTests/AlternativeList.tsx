import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { Gap } from "../../config/api/clozeTests/clozeTests.types";
import COLORS from "../../constants/colors";

type Props = {
  alternatives: Gap[];
};

const AlternativeList: React.FC<Props> = (props) => {
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
        {props.alternatives.map((gap) => (
          <ListItem key={gap.index} disablePadding>
            <ListItemButton>
              <ListItemText>{gap.word}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AlternativeList;
