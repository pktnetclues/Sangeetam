import ReactPlayer from "react-player/lazy";
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  videoUrl: string;
  CreatedBy: string;
  category: string;
}

const VideoPlayer: React.FC<VideoCardProps> = ({
  title,
  thumbnail,
  videoUrl,
  category,
  CreatedBy,
}) => {
  return (
    <div>
      <Card
        sx={{
          maxWidth: 345,
          overflow: "hidden",
        }}
      >
        <ReactPlayer width="100%" height="200px" controls url={videoUrl} />
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
    </div>
  );
};

export default VideoPlayer;
