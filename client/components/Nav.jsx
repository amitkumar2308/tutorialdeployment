import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  MenuItem,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";
import blackLogoImage from "../public/connXblack.png";
import { UserContext } from "../context"; // Import your user context
import { useRouter } from "next/router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Nav = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [state, setState] = useContext(UserContext); // Get the authentication state from context
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null); // Update the authentication state to null when logging out
    router.push("/login");
  };

  // Function to highlight search query in the page
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    const searchRegex = new RegExp(`(${searchQuery})`, "gi");

    // Traverse through all text nodes and wrap search query matches with a span
    const highlightMatches = (node) => {
      if (node.nodeType === 3) { // Text node
        const matches = node.nodeValue.match(searchRegex);
        if (matches) {
          const span = document.createElement("span");
          span.innerHTML = node.nodeValue.replace(
            searchRegex,
            `<span style="background-color: yellow;">$1</span>`
          );
          node.replaceWith(span);
        }
      } else {
        node.childNodes.forEach(highlightMatches);
      }
    };

    document.body.childNodes.forEach(highlightMatches);
  };

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ backgroundColor: "#FFFF" }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link href="/">
              <Image src={blackLogoImage} alt="Logo" width={100} height={22} />
            </Link>
            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
              <Button
                component={Link}
                href="/"
                sx={{
                  color: "black",
                  textTransform: "none",
                  marginRight: "10px",
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                href="/contribution"
                sx={{
                  color: "black",
                  textTransform: "none",
                  marginRight: "10px",
                }}
              >
                Become Contributor
              </Button>
              <Button
                component={Link}
                href="/about"
                sx={{
                  color: "black",
                  textTransform: "none",
                  marginRight: "10px",
                }}
              >
                About
              </Button>
              <Button
                component={Link}
                href="/community"
                sx={{
                  color: "black",
                  textTransform: "none",
                  marginRight: "10px",
                }}
              >
                Community
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", position: "relative", flexGrow: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: "white",
                  width: "70%",
                  borderRadius: "3px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  right: 50,
                  top: 0,
                  bottom: 0,
                  width: "20%",
                  backgroundColor: "black",
                  borderRadius: "0 3px 3px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton sx={{ color: "white" }} onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {state ? (
                <Button
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    marginRight: "10px",
                    padding: "1rem",
                  }}
                >
                  {state.user && state.user.username}
                </Button>
              ) : (
                <Button
                  component={Link}
                  href="/register"
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    marginRight: "10px",
                    padding: "1rem",
                  }}
                >
                  Login/Register
                </Button>
              )}
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ display: { xs: "block", md: "none" }, marginRight: "10px" }}
            >
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          {/* Conditionally render the AccountCircleIcon */}
          {state && (
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: "black",
                  padding: "6px",
                  marginRight: "10px",
                  marginTop: "5px",
                }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={Link}
                  href="/dashboard"
                  onClick={handleMenuClose}
                >
                  <DashboardIcon sx={{ marginRight: "10px" }} />
                  Dashboard
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/user/profile/update"
                  onClick={handleMenuClose}
                >
                  <AccountCircleIcon sx={{ marginRight: "10px" }} />
                  My Profile
                </MenuItem>
                <MenuItem onClick={logout}>
                  <LogoutIcon sx={{ marginRight: "10px" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
        <List>
          <ListItem
            button
            component={Link}
            href="/"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={Link}
            href="/contribution"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="Become Contributor" />
          </ListItem>
          <ListItem
            button
            component={Link}
            href="/about"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            button
            component={Link}
            href="/community"
            onClick={handleDrawerClose}
          >
            <ListItemText primary="Community" />
          </ListItem>
          {/* Conditionally render the logout button based on authentication state */}
          {state && (
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
          {/* Conditionally render the login/register button based on authentication state */}
          {!state && (
            <ListItem
              button
              component={Link}
              href="/register"
              onClick={handleDrawerClose}
            >
              <ListItemText primary="Login/Register" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Nav;
