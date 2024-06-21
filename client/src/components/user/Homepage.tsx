import React, { useEffect, useState } from "react";
import GetAudios from "../common/GetAudios";
import { AudioType, VideoType } from "../../types";
import {
  Box,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import AudioCard from "../common/AudioCard";
import { Link } from "react-router-dom";
import GetVideos from "../common/GetVideos";
import VideoCard from "../common/VideoCard";
import RequestContentUpload from "./RequestContentUpload";
import LoaderIcon from "../common/Loader";

const Homepage: React.FC = () => {
  const [audios, setAudios] = useState<AudioType[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const CallAPI = async () => {
      setLoading(true);
      const getAudios: AudioType[] = await GetAudios();
      const latestAudios = getAudios.slice(0, 5);
      setAudios(latestAudios);
      const getVideos: VideoType[] = await GetVideos();
      const latestVideos = getVideos.slice(0, 5);
      setVideos(latestVideos);
      setLoading(false);
    };
    CallAPI();
  }, []);

  return (
    <div style={{ marginLeft: 250, padding: 20, marginRight: 20 }}>
      {loading ? (
        <LoaderIcon />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "100%",
              my: "10px",
            }}
          >
            <Typography variant="h5"> Latest Audios</Typography>
            <Link to={"/user/audios"}>
              <Button>View All</Button>
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
            }}
          >
            {audios.map((audio) => (
              <AudioCard audio={audio} key={audio.audioId} />
            ))}
          </Box>
          <div>
            <Divider sx={{ mt: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "100%",
                my: "20px",
              }}
            >
              <Typography variant="h5"> Latest Videos</Typography>
              <Link to={"/user/videos"}>
                <Button>View All</Button>
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                width: "100%",
              }}
            >
              {videos.map((video) => (
                <VideoCard video={video} key={video.videoId} />
              ))}
            </Box>
          </div>
          <RequestContentUpload />
        </>
      )}
    </div>
  );
};

export default Homepage;
