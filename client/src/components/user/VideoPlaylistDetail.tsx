import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoCard from "../common/VideoCard";

const VideoPlaylistDetail = () => {
  const { playlistId } = useParams();

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const response = await axios.get(
          `/api/get-playlist-videos/${playlistId}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          setVideos(response.data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    getPlaylists();
  }, [playlistId]);

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
        }}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard key={video.video.videoId} video={video.video} />
          ))
        ) : (
          <Typography>No Item in Playlist</Typography>
        )}
      </Box>
    </div>
  );
};

export default VideoPlaylistDetail;
