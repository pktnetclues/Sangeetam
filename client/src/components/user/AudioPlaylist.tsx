import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const AudioPlaylist: React.FC = () => {
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
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Audios Playlists
      </Typography>
      <Grid container spacing={2}>
        {playlists.map((playlist) => (
          <Grid item xs={12} sm={6} md={4} key={playlist?.playlistId}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {playlist?.playlistName}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/user/playlist/${playlist?.playlistId}`}>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AudioPlaylist;
