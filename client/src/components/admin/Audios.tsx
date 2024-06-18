import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { AudioType } from "../../types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import UploadAudio from "../common/UploadAudio";

const Audios: React.FC = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);

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

  const handleEdit = (audioId: number) => {
    // Handle edit functionality
    console.log("Edit audio with ID:", audioId);
  };

  const handleDelete = (audioId: number) => {
    // Handle delete functionality
    console.log("Delete audio with ID:", audioId);
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Grid container spacing={3}>
        {audios.map((audio) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={audio.audioId}>
            <Card elevation={3}>
              {/* Replace with actual audio thumbnail */}
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <AudioPlayer
                  showSkipControls={false}
                  autoPlay={false}
                  src={`http://localhost:4000/assets/audios/${audio.audioUrl}`}
                />

                <Box>
                  <Button
                    size="small"
                    onClick={() => handleEdit(audio.audioId)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDelete(audio.audioId)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <UploadAudio />
    </div>
  );
};

export default Audios;
