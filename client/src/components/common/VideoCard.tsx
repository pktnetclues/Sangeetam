import { FC, useRef, useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Slide,
  IconButton,
} from "@mui/material";
import { TimeAgo } from "./Timeago";
import AddToPlaylist from "./AddToPlaylist";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface VideoCardProps {
  video: {
    createdAt: string;
    videoId: number;
    title: string;
    thumbnail: string;
    videoUrl: string;
    CreatedBy: string;
    Category: { categoryName: string };
    user: { name: string };
  };
}

const VideoCard: FC<VideoCardProps> = ({ video }) => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setLoadVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
      setPlayVideo(true);
    }
  };

  return (
    <Card
      sx={{
        width: "270px",
        borderRadius: "12px",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
        ":hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        },
      }}>
      <CardActionArea
        sx={{
          height: "150px",
          padding: 0,
          margin: 0,
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
        }}>
        <Box
          sx={{
            position: "relative",
            paddingTop: "56.25%",
            margin: 0,
            padding: 0,
            height: "150px",
            width: "100%",
          }}>
          {!loadVideo ? (
            <Slide
              direction="down"
              in={!loadVideo}
              mountOnEnter
              unmountOnExit
              timeout={400}>
              <CardMedia
                component="img"
                height="150%"
                image={`http://localhost:4000/assets/thumbnails/${video.thumbnail}`}
                alt={video.title}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "150px",
                  margin: 0,
                  padding: 0,
                  objectFit: "cover",
                  borderRadius: "12px 12px 0 0",
                }}
              />
            </Slide>
          ) : (
            <video
              ref={videoRef}
              width="100%"
              height="150px"
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                padding: 0,
                margin: 0,
                height: "150px",
                borderRadius: "12px 12px 0 0",
              }}>
              <source
                src={`http://localhost:4000/assets/videos/${video.videoUrl}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
          {!loadVideo && (
            <IconButton
              onClick={handlePlayVideo}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                transition: "all 0.3s ease-in-out",
                ":hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}>
              {playVideo ? (
                <PauseCircleOutline fontSize="large" />
              ) : (
                <PlayCircleOutline fontSize="large" />
              )}
            </IconButton>
          )}
        </Box>
      </CardActionArea>
      <CardContent
        sx={{
          padding: "16px",
          "&:last-child": {
            paddingBottom: "16px",
          },
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Link
            to={`/user/video/${video.videoId}`}
            state={{
              videoUrl: `http://localhost:4000/assets/videos/${video.videoUrl}`,
              title: video.title,
              createdBy: video.user.name,
              category: video.Category.categoryName,
              createdAt: video.createdAt,
              views: 0,
            }}
            style={{ textDecoration: "none" }}>
            <Typography
              gutterBottom
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold", fontSize: "18px" }}>
              {video.title}
            </Typography>
          </Link>
          <AddToPlaylist contentId={video.videoId} contentType="video" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Category: {video.Category.categoryName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          CreatedBy:{" "}
          {video.user.name === "Admin" ? "Team Sangeetam" : video.user.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontSize: "14px" }}>
          {TimeAgo(video.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
