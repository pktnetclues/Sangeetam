import React, { useState } from "react";
import UploadAudio from "../common/UploadAudio";
import UploadVideo from "../common/UploadVideo";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  Box,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useLocation } from "react-router-dom";

const RequestContentUpload: React.FC = () => {
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleAudioDialog = () => setAudioDialogOpen((prev) => !prev);
  const handleVideoDialog = () => setVideoDialogOpen((prev) => !prev);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const { pathname } = location;
  console.log(pathname);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100lvh",
        display: "flex",
        alignItems: "center",
      }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          color="primary"
          textAlign="center">
          {pathname === "/admin/upload"
            ? "Upload New Content"
            : "Request Content Upload"}
        </Typography>
        <Typography
          variant="body1"
          paragraph
          color="text.secondary"
          textAlign="center">
          {pathname === "/admin/upload"
            ? "Share your music, podcasts, or audio stories"
            : "Request to share your music, podcasts, or audio stories"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
            mt: 4,
          }}>
          <ButtonWithDialog
            title="Upload New Audio"
            caption="Share your music, podcasts, or audio stories"
            icon={<AudiotrackIcon />}
            showDialog={handleAudioDialog}
            dialogOpen={audioDialogOpen}
            dialogContent={<UploadAudio closeDialog={handleAudioDialog} />}
          />
          <ButtonWithDialog
            title="Upload New Video"
            caption="Share your films, vlogs, or video content"
            icon={<VideocamIcon />}
            showDialog={handleVideoDialog}
            dialogOpen={videoDialogOpen}
            dialogContent={<UploadVideo closeDialog={handleVideoDialog} />}
          />
        </Box>
      </Paper>
    </Container>
  );
};

interface ButtonWithDialogProps {
  title: string;
  caption: string;
  icon: React.ReactNode;
  showDialog: () => void;
  dialogOpen: boolean;
  dialogContent: React.ReactNode;
}

const ButtonWithDialog: React.FC<ButtonWithDialogProps> = ({
  title,
  caption,
  icon,
  showDialog,
  dialogOpen,
  dialogContent,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={showDialog}
        startIcon={icon}
        sx={{
          p: 3,
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
        }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </Button>
      <Dialog open={dialogOpen} onClose={showDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={showDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{dialogContent}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequestContentUpload;
