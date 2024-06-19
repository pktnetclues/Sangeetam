import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  videoUrl: string;
  CreatedBy: string;
  category: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  thumbnail,
  videoUrl,
  category,
  CreatedBy,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9); // Default aspect ratio (16:9)

  // Load video metadata to get aspect ratio
  React.useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.onloadedmetadata = () => {
        const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
        setVideoAspectRatio(aspectRatio);
      };
    }
  }, [videoUrl]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardActionArea sx={{ height: 200 }}>
        <div
          style={{
            position: "relative",
            paddingTop: `${(1 / videoAspectRatio) * 100}%`,
          }}
        >
          {isHovered ? (
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              muted
              loop
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <CardMedia
              component="img"
              height="100%"
              image={thumbnail}
              alt={title}
              sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
            />
          )}
        </div>
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          CreatedBy: {CreatedBy}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
