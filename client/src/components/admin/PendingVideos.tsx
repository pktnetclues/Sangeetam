import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import AddToPlaylist from "../common/AddToPlaylist";
import { TimeAgo } from "../common/Timeago";
import ApproveContent from "./ApproveContent";

const PendingVideos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loadVideo, setLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setLoadVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const res = await axios.get("/api/pending-videos", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setVideos(res.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Typography variant="h5" sx={{ padding: 1 }}>
        Pending Videos
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
        }}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <Card
              sx={{ width: "22%", position: "relative", overflow: "hidden" }}>
              <CardActionArea sx={{ height: 200 }}>
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                  }}>
                  {!loadVideo ? (
                    <>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={`http://localhost:4000/assets/thumbnails/${video.thumbnail}`}
                        alt={video.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                        }}
                      />
                      <Button
                        onClick={handlePlayVideo}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                        }}>
                        Play Video
                      </Button>
                    </>
                  ) : (
                    <video
                      ref={videoRef}
                      width="100%"
                      height="100%"
                      controls
                      style={{ position: "absolute", top: 0, left: 0 }}>
                      <source
                        src={`http://localhost:4000/assets/videos/${video.videoUrl}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </CardActionArea>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {video.title}
                  </Typography>
                  <AddToPlaylist
                    contentId={video.videoId}
                    contentType="video"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Category: {video.Category.categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CreatedBy:{" "}
                  {video.user.name === "Admin"
                    ? "Team Sangeetam"
                    : video.user.name}
                </Typography>
                <Typography variant="subtitle2">
                  {TimeAgo(video.createdAt)}
                </Typography>
                <ApproveContent
                  contentId={video.videoId}
                  contentType="video"
                  getContents={getVideos}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert severity="info">No pending videos found.</Alert>
        )}
      </Box>
    </div>
  );
};

export default PendingVideos;
