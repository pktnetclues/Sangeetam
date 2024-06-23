import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import DeleteVideo from "./DeleteVideo";
import EditVideo from "./EditVideo";
import { VideoType } from "../../types";
import VideoCard from "../common/VideoCard";

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const res = await axios.get("/api/all-videos", {
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
    <Box
      sx={{
        padding: { lg: "20px" },
        marginLeft: { lg: "250px" },
      }}>
      <h2>All Videos</h2>

      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: "20px", width: "100%" }}>
        {videos.map((video) => (
          <Box
            key={video.videoId}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <VideoCard video={video} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mt: "10px",
                gap: "10px",
              }}>
              <EditVideo videoDetails={video} callVideos={getVideos} />
              <DeleteVideo videoId={video.videoId} getVideos={getVideos} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Videos;
