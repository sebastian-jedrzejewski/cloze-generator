import { Box, Drawer, Toolbar } from "@mui/material";
import React from "react";
import COLORS from "../../constants/colors";

const drawerWidth = 240;

type Props = {
  isOpen: boolean;
  toggleHandler: () => void;
};

const SidebarDrawer: React.FC<Props> = (props) => {
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
      ></Box>
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
