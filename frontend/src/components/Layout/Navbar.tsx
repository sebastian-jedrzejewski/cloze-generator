import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import SidebarDrawer from "./SidebarDrawer";

import logo from "../../assets/vite.svg";
import { AuthContext } from "../../store/AuthContext/AuthContext";
import MenuAvatar from "../UI/MenuAvatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logoutHandler = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Box
              component="img"
              src={logo}
              width="auto"
              height={50}
              sx={{ mr: "10px" }}
            />
          </Link>
          <Typography
            variant="h6"
            component={Link}
            className="link"
            to="/"
            sx={{
              display: "block",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              cursor: "pointer",
              fontSize: { xs: "1rem", md: "1.5rem" },
            }}
          >
            Cloze Generator
          </Typography>

          <Box sx={{ flexGrow: 1 }}></Box>
          {isAuthenticated && (
            <>
              <MenuAvatar />
              <Button
                variant="contained"
                color="secondary"
                onClick={logoutHandler}
                sx={{ ml: "15px" }}
              >
                Logout
              </Button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Button
                variant="contained"
                color="info"
                sx={{ mr: "15px" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SidebarDrawer isOpen={mobileOpen} toggleHandler={handleDrawerToggle} />
    </>
  );
};

export default Navbar;
