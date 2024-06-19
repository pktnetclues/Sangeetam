import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { VideoType } from "../../types";
import GetVideos from "../common/GetVideos";
import VideoCard from "../common/VideoCard";

const AllVideos = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  useEffect(() => {
    const CallAPI = async () => {
      const getVideos: VideoType[] = await GetVideos();

      setVideos(getVideos);
    };
    CallAPI();
  }, []);
  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            // justifyContent: "center",
            width: "100%",
          }}
        >
          {videos.map((video) => (
            <VideoCard video={video} key={video.videoId} />
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default AllVideos;
