import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DraftsIcon from "@mui/icons-material/Drafts";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import COLORS from "../../constants/colors";
import LoadingSpinner from "../UI/LoadingSpinner";
import clozeTestsApi from "../../config/api/clozeTests/clozeTests";
import ErrorMessage from "../UI/ErrorMessage";
import MESSAGES from "../../constants/messages";
import { ClozeTestListDTO } from "../../config/api/clozeTests/clozeTests.types";
import { AuthContext } from "../../store/AuthContext/AuthContext";

const drawerWidth = { xs: 240, md: 300 };

type Props = {
  isOpen: boolean;
  toggleHandler: () => void;
};

const SidebarDrawer: React.FC<Props> = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: clozeTests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clozeTests"],
    queryFn: clozeTestsApi.getClozeTests,
  });

  const navigateToTestDetails = (test: ClozeTestListDTO) => {
    if (test.isDraft) {
      navigate(`/cloze-tests/drafts/${test.id}`);
    } else {
      navigate(`/cloze-tests/${test.id}`);
    }
  };

  const drawer = (
    <>
      <Toolbar />
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {isError && <ErrorMessage message={MESSAGES.SOMETHING_WENT_WRONG} />}
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              color="secondary"
              variant="contained"
              sx={{ my: "1rem" }}
              onClick={() => navigate("/cloze-tests/generate")}
            >
              Create Test
            </Button>
            <Divider />
            <List sx={{ color: COLORS.black200 }}>
              {isAuthenticated && clozeTests?.length === 0 && (
                <Typography sx={{ textAlign: "center", mt: "10px" }}>
                  You don't have any tests.
                </Typography>
              )}
              {!isAuthenticated && (
                <Typography sx={{ textAlign: "center", mt: "10px" }}>
                  To save your test on your account you have to login.
                </Typography>
              )}
              {clozeTests?.map((test) => (
                <ListItem
                  key={test.id}
                  sx={{
                    p: 0,
                    bgcolor: id && test.id == id ? COLORS.gray500 : "inherit",
                  }}
                >
                  <Tooltip
                    title={test.title?.length > 20 ? test.title : ""}
                    placement="right"
                  >
                    <ListItemButton onClick={() => navigateToTestDetails(test)}>
                      <ListItemIcon>
                        {test.isDraft ? <DraftsIcon /> : <TextFieldsIcon />}
                      </ListItemIcon>
                      <ListItemText>
                        {test.shortTitle} {test.isDraft ? "(Draft)" : ""}
                      </ListItemText>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={props.isOpen}
        onClose={props.toggleHandler}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: `2px solid ${COLORS.gray500}`,
            bgcolor: COLORS.gray300,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `2px solid ${COLORS.gray500}`,
            bgcolor: COLORS.gray300,
          },
          display: { xs: "none", md: "block" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default SidebarDrawer;
