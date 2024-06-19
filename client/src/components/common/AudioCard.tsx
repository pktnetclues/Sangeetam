import React, { FC, useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { AudioType } from "../../types";
import ReactPlayer from "react-player/lazy";

interface AudioCardProps {
  audio: AudioType;
}

const AudioCard: FC<AudioCardProps> = ({ audio }) => {
  const [loadAudio, setLoadAudio] = useState(false);

  const handlePlayAudio = () => {
    setLoadAudio(true);
  };

  return (
    <Card elevation={3} sx={{ width: "19%", borderRadius: 2 }}>
      <Box sx={{ height: 140, position: "relative" }}>
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
          }}
          src={`http://localhost:4000/assets/thumbnails/${audio.thumbnail}`}
          alt={audio.album}
        />
        {!loadAudio && (
          <Button
            onClick={handlePlayAudio}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "8px 16px",
            }}
          >
            Play Audio
          </Button>
        )}
      </Box>
      <CardContent sx={{ padding: 2 }}>
        <Typography gutterBottom variant="subtitle1" component="div">
          {audio.album}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Singer: {audio.singerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Writer: {audio.writerName}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        {loadAudio && (
          <ReactPlayer
            height="30px"
            width="100%"
            controls
            url={`http://localhost:4000/assets/audios/${audio.audioUrl}`}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default AudioCard;
