import {
  Avatar,
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
import GroupIcon from "@mui/icons-material/Group";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { label: "All Users", icon: <GroupIcon />, path: "/admin/users" },
    {
      label: "Pending Users",
      icon: <HowToRegIcon />,
      path: "/admin/pending-users",
    },
    { label: "Audios", icon: <AudiotrackIcon />, path: "/admin/audios" },
    { label: "Videos", icon: <OndemandVideoIcon />, path: "/admin/videos" },
    {
      label: "Profile",
      icon: <Avatar src={""} />,
      path: "/profile",
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
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.action.selected,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
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
