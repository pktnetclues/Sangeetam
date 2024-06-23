import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import ApproveContent from "./ApproveContent";
import ReactPlayer from "react-player";
import AddToPlaylist from "../common/AddToPlaylist";
import { TimeAgo } from "../common/Timeago";

const PendingAudios: React.FC = () => {
  const [audios, setAudios] = useState<any[]>([]);

  useEffect(() => {
    getAudios();
  }, []);

  const getAudios = async () => {
    try {
      const res = await axios.get("/api/pending-audios", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAudios(res.data);
      }
    } catch (error) {
      console.error("Error fetching audios:", error);
    }
  };

  const [loadAudio, setLoadAudio] = useState(false);

  const handlePlayAudio = () => {
    setLoadAudio(true);
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Typography variant="h5" sx={{ padding: 1 }}>
        Pending Audios
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",

          width: "100%",
        }}>
        {audios.length > 0 ? (
          audios.map((audio) => (
            <Card
              key={audio.audioId}
              elevation={3}
              sx={{ width: "22%", borderRadius: 2 }}>
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
                    }}>
                    Play Audio
                  </Button>
                )}
              </Box>
              <CardContent sx={{ padding: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {audio.album}
                  </Typography>
                  <AddToPlaylist
                    contentId={audio.audioId}
                    contentType="audio"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Singer: {audio.singerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Writer: {audio.writerName}
                </Typography>
                <Typography variant="subtitle2">
                  {TimeAgo(audio.createdAt)}
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
                <ApproveContent
                  contentId={audio.audioId}
                  contentType="audio"
                  getContents={getAudios}
                />
              </CardActions>
            </Card>
          ))
        ) : (
          <Alert severity="info">No pending audios found.</Alert>
        )}
      </Box>
    </div>
  );
};

export default PendingAudios;
