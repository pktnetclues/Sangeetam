import { FC, useRef, useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const VideoPlayer: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state } = useLocation();
  const { videoUrl, title, createdAt } = state || {};

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setIsLoading(false);
    const handleError = () => {
      setError("An error occurred while loading the video.");
      setIsLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        width: "80%",
        marginLeft: "250px",
      }}>
      <div
        style={{
          backgroundColor: "#000",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "20px",
        }}>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ width: "100%", height: "auto" }}>
          Your browser does not support the video tag.
        </video>

        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}>
            {error}
          </div>
        )}
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
          variant="h5">
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {new Date(createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </div>
  );
};

export default VideoPlayer;
