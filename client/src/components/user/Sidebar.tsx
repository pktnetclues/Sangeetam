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
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";
import { toast } from "sonner";
import { HomeRounded } from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  const menuItems = [
    { label: "Homepage", icon: <HomeRounded />, path: "/user/home" },
    { label: "Audios", icon: <AudiotrackIcon />, path: "/admin/audios" },
    { label: "Videos", icon: <OndemandVideoIcon />, path: "/admin/videos" },
    {
      label: "Logout",
      icon: <ExitToAppIcon />,
      onClick: handleLogout,
    },
  ];

  if (isSmallScreen) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Typography
          sx={{
            textAlign: "center",
            padding: "10px",
          }}
        >
          Sangeetam
        </Typography>
        <Divider />
        <List
          sx={{
            mt: "10px",
          }}
        >
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={item.onClick || (() => navigate(item.path))}
                selected={item.path ? location.pathname === item.path : false}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
