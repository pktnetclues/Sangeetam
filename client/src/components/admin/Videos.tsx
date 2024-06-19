import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadVideo from "../common/UploadVideo";
import axios from "axios";
import DeleteVideo from "./DeleteVideo";
import VideoPlayer from "../common/VideoPlayer";
import EditVideo from "./EditVideo";

const Videos: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const res = await axios.get("/api/all-videos", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setVideos(res.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
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
        onClick={handleClickDialog}
      >
        Upload new Video
      </Button>
      <Dialog open={open} onClose={handleClickDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Video
          <IconButton
            aria-label="close"
            onClick={handleClickDialog}
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
        <DialogContent>
          <UploadVideo closeDialog={handleClickDialog} callVideos={getVideos} />
        </DialogContent>
      </Dialog>

      <Grid container spacing={2}>
        {videos.map((video) => (
          <Grid item key={video.videoId} xs={12} sm={6} md={4} lg={3}>
            <VideoPlayer
              title={video.title}
              thumbnail={`http://localhost:4000/assets/thumbnails/${video.thumbnail}`}
              videoUrl={`http://localhost:4000/assets/videos/${video.videoUrl}`}
              category={video.Category.categoryName}
              CreatedBy={video.user.name}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <DeleteVideo videoId={video.videoId} getVideos={getVideos} />
              <EditVideo videoDetails={video} callVideos={getVideos} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Videos;
