import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

interface Playlist {
  playlistId: number;
  playlistName: string;
}

const VideoPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const GetPlaylists = async () => {
      try {
        const response = await axios.get("/api/get-video-playlist", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPlaylists(response.data);
        }
      } catch (error) {
        console.error("Error fetching video playlist:", error);
      }
    };
    GetPlaylists();
  }, []);

  return (
    <Box
      sx={{
        mt: 2,
        background: "linear-gradient(to right, #f4f4f4, #e2e2e2)",
        padding: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Videos Playlists
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {playlists.map((playlist) => (
          <Box
            key={playlist?.playlistId}
            sx={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: 1,
              width: "20%",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              {playlist?.playlistName}
            </Typography>
            <Link to={`/user/playlist/video/${playlist?.playlistId}`}>
              <Button variant="text" size="small" color="primary" fullWidth>
                View Details
              </Button>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default VideoPlaylists;
