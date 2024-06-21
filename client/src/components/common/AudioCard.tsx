import { FC, useState, useEffect } from "react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  CircularProgress,
  Grid,
  Slide,
} from "@mui/material";
import { AudioType } from "../../types";
import ReactPlayer from "react-player/lazy";
import AddToPlaylist from "./AddToPlaylist";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";

interface AudioCardProps {
  audio: AudioType;
}

const AudioCard: FC<AudioCardProps> = ({ audio }) => {
  const [playAudio, setPlayAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    if (playAudio) {
      setAudioLoading(true);
      setTimeout(() => {
        setAudioLoading(false);
      }, 2000);
    }
  }, [playAudio]);

  const handlePlayAudio = () => {
    setPlayAudio(true);
  };

  const handlePauseAudio = () => {
    setPlayAudio(false);
  };

  return (
    <Card
      key={audio.audioId}
      elevation={3}
      sx={{
        width: "19%",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.01)",
        },
      }}
    >
      <Box sx={{ height: 140, position: "relative" }}>
        <Slide direction="up" in mountOnEnter unmountOnExit timeout={400}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={`http://localhost:4000/assets/thumbnails/${audio.thumbnail}`}
            alt={audio.album}
          />
        </Slide>
        <IconButton
          onClick={playAudio ? handlePauseAudio : handlePlayAudio}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "8px",
            borderRadius: "50%",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {playAudio ? (
            <PauseCircleOutline fontSize="large" />
          ) : (
            <PlayCircleOutline fontSize="large" />
          )}
        </IconButton>
      </Box>
      <CardContent sx={{ padding: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="subtitle1" component="div" noWrap>
              {audio.album}
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <AddToPlaylist contentId={audio.audioId} contentType="audio" />
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" noWrap>
          Singer: {audio.singerName}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Writer: {audio.writerName}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 2, justifyContent: "center" }}>
        {playAudio && (
          <ReactPlayer
            height="30px"
            width="100%"
            controls
            url={`http://localhost:4000/assets/audios/${audio.audioUrl}`}
            playing={playAudio}
            onReady={() => setAudioLoading(false)}
            onError={() => setAudioLoading(false)}
            onBuffer={() => setAudioLoading(true)}
          />
        )}
        {audioLoading && (
          <CircularProgress size={20} sx={{ color: "primary.main" }} />
        )}
      </CardActions>
    </Card>
  );
};

export default AudioCard;
