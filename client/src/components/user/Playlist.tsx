import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideocamIcon from "@mui/icons-material/Videocam";
import LoaderIcon from "../common/Loader";

interface Playlist {
  playlistId: number;
  playlistName: string;
}

const Playlist: React.FC = () => {
  const [audioPlaylists, setAudioPlaylists] = useState<Playlist[]>([]);
  const [videoPlaylists, setVideoPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const audioResponse = await axios.get("/api/get-audio-playlist", {
          withCredentials: true,
        });
        const videoResponse = await axios.get("/api/get-video-playlist", {
          withCredentials: true,
        });
        if (audioResponse.status === 200) {
          setAudioPlaylists(audioResponse.data);
        }
        if (videoResponse.status === 200) {
          setVideoPlaylists(videoResponse.data);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  if (loading) {
    return <LoaderIcon />;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "flex-start",
      }}>
      <AudioPlaylist playlists={audioPlaylists} />
      <VideoPlaylists playlists={videoPlaylists} />
    </Container>
  );
};

interface PlaylistCardProps {
  playlist: Playlist;
  icon: React.ReactNode;
  link: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  icon,
  link,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to={link}
        startIcon={icon}
        sx={{
          p: 3,
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
        }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {playlist.playlistName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click to explore this playlist
        </Typography>
      </Button>
    </Box>
  );
};

interface PlaylistSectionProps {
  title: string;
  description: string;
  playlists: Playlist[];
  icon: React.ReactNode;
  link: string;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  description,
  playlists,
  icon,
  link,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: 4, borderRadius: 2, width: "100%" }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        color="primary"
        textAlign="left">
        {title}
      </Typography>
      <Typography
        variant="body1"
        paragraph
        color="text.secondary"
        textAlign="left">
        {description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          mt: 4,
        }}>
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.playlistId}
            playlist={playlist}
            icon={icon}
            link={link.replace(":id", playlist.playlistId.toString())}
          />
        ))}
      </Box>
    </Box>
  );
};

const AudioPlaylist: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  return (
    <PlaylistSection
      title="Audio Playlists"
      description="Browse through your audio playlists and explore your favorite music, podcasts, or audio stories. Click on a playlist to see its contents."
      playlists={playlists}
      icon={<AudiotrackIcon />}
      link="/user/playlist/audio/:id"
    />
  );
};

const VideoPlaylists: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  return (
    <PlaylistSection
      title="Video Playlists"
      description="Browse through your video playlists and explore your favorite films, vlogs, or video content. Click on a playlist to see its contents."
      playlists={playlists}
      icon={<VideocamIcon />}
      link="/user/playlist/video/:id"
    />
  );
};

export default Playlist;
