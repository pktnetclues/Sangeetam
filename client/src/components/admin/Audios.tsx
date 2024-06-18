import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { AudioType } from "../../types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import UploadAudio from "../common/UploadAudio";
import CloseIcon from "@mui/icons-material/Close";
import DeleteAudio from "./DeleteAudio";

const Audios: React.FC = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAudios();
  }, []);

  const getAudios = async () => {
    try {
      const response = await axios.get("/api/all-audios", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAudios(response.data);
      }
    } catch (error) {
      console.error("Error fetching audios:", error);
    }
  };

  const handleClickDialog = () => {
    setOpen(!open);
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Button
        sx={{
          my: 2,
        }}
        variant="outlined"
        color="primary"
        onClick={handleClickDialog}>
        Upload new Audio
      </Button>
      <Dialog open={open} onClose={handleClickDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Audio
          <IconButton
            aria-label="close"
            onClick={handleClickDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UploadAudio closeDialog={handleClickDialog} callAudios={getAudios} />
        </DialogContent>
      </Dialog>
      <Grid container spacing={3}>
        {audios.map((audio) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={audio.audioId}>
            <Card
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}>
              <Box sx={{ height: 140 }}>
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={`http://localhost:4000/assets/thumbnails/${audio.thumbnail}`}
                  alt={audio.album}
                />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {audio.album}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Singer: {audio.singerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Writer: {audio.writerName}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ flexDirection: "column", alignItems: "stretch" }}>
                <AudioPlayer
                  showSkipControls={false}
                  autoPlay={false}
                  src={`http://localhost:4000/assets/audios/${audio.audioUrl}`}
                  style={{ width: "100%" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}>
                  <DeleteAudio audioId={audio.audioId} getAudios={getAudios} />
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Audios;
