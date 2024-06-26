import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioCard from "../common/AudioCard";
import { AudioType } from "../../types";

interface PlaylistAudio {
  id: number;
  playlistId: number;
  audioId: number;
  createdAt: string;
  updatedAt: string;
  audio: AudioType;
}

const AudioPlaylistDetail: React.FC = () => {
  const { playlistId } = useParams();

  const [audios, setAudios] = useState<PlaylistAudio[]>([]);

  useEffect(() => {
    const GetPlaylists = async () => {
      try {
        const response = await axios.get(
          `/api/get-playlist-audios/${playlistId}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          setAudios(response.data);
        }
      } catch (error) {
        console.error("Error fetching audios:", error);
      }
    };
    GetPlaylists();
  }, []);
  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
        }}>
        {audios.length > 0 ? (
          audios.map((audio) => (
            <AudioCard audio={audio.audio} key={audio.audio.audioId} />
          ))
        ) : (
          <Typography>No Item in Playlist</Typography>
        )}
      </Box>
    </div>
  );
};

export default AudioPlaylistDetail;
