import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import axios from "axios";
import VideoCard from "../common/VideoCard";

const PendingVideos: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);

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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          //   justifyContent: "center",
          width: "100%",
        }}
      >
        {videos.map((video) => (
          <VideoCard video={video} key={video.videoId} />
        ))}
      </Box>
    </div>
  );
};

export default PendingVideos;
