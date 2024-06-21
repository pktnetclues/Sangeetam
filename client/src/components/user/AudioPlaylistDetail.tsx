import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioCard from "../common/AudioCard";

const AudioPlaylistDetail = () => {
  const { playlistId } = useParams();

  const [audios, setAudios] = useState([]);

  useEffect(() => {
    const GetPlaylists = async () => {
      try {
        const response = await axios.get(
          `/api/get-playlist-audios/${playlistId}`,
          {
            withCredentials: true,
          }
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
          //   justifyContent: "center",
          width: "100%",
        }}
      >
        {audios.length > 0 ? (
          audios.map((audio) => <AudioCard audio={audio.audio} />)
        ) : (
          <Typography>No Item in Playlist</Typography>
        )}
      </Box>
    </div>
  );
};

export default AudioPlaylistDetail;
