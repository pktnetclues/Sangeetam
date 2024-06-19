import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  Grid,
} from "@mui/material";
import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { AudioType } from "../../types";

const AudioCard: React.FC<AudioType> = ({ audio }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
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
        <CardActions sx={{ flexDirection: "column", alignItems: "stretch" }}>
          <AudioPlayer
            showSkipControls={false}
            autoPlay={false}
            src={`http://localhost:4000/assets/audios/${audio.audioUrl}`}
            style={{ width: "100%" }}
          />
        </CardActions>
      </Card>
    </Grid>
  );
};

export default AudioCard;
