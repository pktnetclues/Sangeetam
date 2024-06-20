import { FC, useRef, useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { TimeAgo } from "./Timeago";

interface VideoCardProps {
  video: {
    title: string;
    thumbnail: string;
    videoUrl: string;
    CreatedBy: string;
    category: { categoryName: string };
    user: { name: string };
  };
}

const VideoCard: FC<VideoCardProps> = ({ video }) => {
  const [loadVideo, setLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setLoadVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <Card sx={{ width: "19%", position: "relative", overflow: "hidden" }}>
      <CardActionArea sx={{ height: 200 }}>
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
          }}
        >
          {!loadVideo ? (
            <>
              <CardMedia
                component="img"
                height="100%"
                image={`http://localhost:4000/assets/thumbnails/${video.thumbnail}`}
                alt={video.title}
                sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
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
                }}
              >
                Play Video
              </Button>
            </>
          ) : (
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              controls
              style={{ position: "absolute", top: 0, left: 0 }}
            >
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
        <Typography gutterBottom variant="subtitle1" component="div">
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {video.Category.categoryName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          CreatedBy:{" "}
          {video.user.name === "Admin" ? "Team Sangeetam" : video.user.name}
        </Typography>
        <Typography variant="subtitle2">{TimeAgo(video.createdAt)}</Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
