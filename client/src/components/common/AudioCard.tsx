import { FC, useEffect, useState } from "react";
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
import axios from "axios";
import AddToPlaylist from "./AddToPlaylist";

interface AudioCardProps {
  audio: AudioType;
}

const AudioCard: FC<AudioCardProps> = ({ audio }) => {
  const [loadAudio, setLoadAudio] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const GetPlaylists = async () => {
      try {
        const response = await axios.get("/api/get-audio-playlist", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPlaylists(response.data);
        }
      } catch (error) {
        console.error("Error fetching audios:", error);
      }
    };
    GetPlaylists();
  }, []);

  const handlePlayAudio = () => {
    setLoadAudio(true);
  };

  return (
    <Card
      key={audio.audioId}
      elevation={3}
      sx={{ width: "19%", borderRadius: 2 }}
    >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography gutterBottom variant="subtitle1" component="div">
            {audio.album}
          </Typography>
          <AddToPlaylist playlists={playlists} audioId={audio.audioId} />
        </Box>
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
