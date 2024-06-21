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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RequestContentUpload = () => {
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const handleAudioDialog = () => {
    setAudioDialogOpen((prevOpen) => !prevOpen);
  };

  const handleVideoDialog = () => {
    setVideoDialogOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      <Divider />
      <Typography variant="h5" mt={2} gutterBottom>
        Request Content Upload
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", mt: 2 }}>
        <ButtonWithDialog
          title="Request to Upload new Audio"
          showDialog={handleAudioDialog}
          dialogOpen={audioDialogOpen}
          dialogContent={<UploadAudio closeDialog={handleAudioDialog} />}
        />
        <ButtonWithDialog
          title="Request to Upload new Video"
          showDialog={handleVideoDialog}
          dialogOpen={videoDialogOpen}
          dialogContent={<UploadVideo closeDialog={handleVideoDialog} />}
        />
      </Box>
    </Box>
  );
};

const ButtonWithDialog = ({
  title,
  showDialog,
  dialogOpen,
  dialogContent,
  children,
}) => {
  return (
    <Box>
      <Button
        sx={{ my: 2 }}
        variant="outlined"
        color="primary"
        onClick={showDialog}
      >
        {title}
      </Button>
      <Dialog open={dialogOpen} onClose={showDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={showDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequestContentUpload;
