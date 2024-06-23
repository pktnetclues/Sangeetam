import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import axios from "axios";
import { toast } from "sonner";
import { HomeRounded } from "@mui/icons-material";
import QueueIcon from "@mui/icons-material/Queue";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  const menuItems = [
    { label: "Home", icon: <HomeRounded />, path: "/user/home" },
    { label: "Audios", icon: <AudiotrackIcon />, path: "/user/audios" },
    { label: "Videos", icon: <OndemandVideoIcon />, path: "/user/videos" },
    { label: "Playlist", icon: <SubscriptionsIcon />, path: "/user/playlist" },
    {
      label: "Upload",
      icon: <QueueIcon />,
      path: "/user/upload",
    },
    { label: "Logout", icon: <ExitToAppIcon />, onClick: handleLogout },
  ];

  if (isSmallScreen) {
    return (
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={item.onClick || (() => handleNavigation(item.path))}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          borderRight: "1px solid rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          padding: "10px",
          overflow: "auto",
        },
      }}>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h6" sx={{ textAlign: "center", padding: "10px" }}>
          <IconButton sx={{ marginRight: "10px" }}>
            <img src="/logo.png" height={40} width={40} />
          </IconButton>
          Sangeetam
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <List sx={{ mt: "10px" }}>
          {menuItems.map((item) => (
            <Tooltip key={item.label} title={item.label} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  onClick={item.onClick || (() => handleNavigation(item.path))}
                  selected={item.path ? location.pathname === item.path : false}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    padding: "10px 20px",
                    borderLeft: "4px solid transparent",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.background.default,
                      borderLeft: "2px solid " + theme.palette.primary.main,
                    },
                  }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ fontSize: 16 }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
