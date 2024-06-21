import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Container,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface PropsType {
  contentId: number;
  contentType: "audio" | "video";
}

interface FormData {
  playlistName: string;
  newPlaylistName?: string;
}

const validationSchema = yup.object().shape({
  playlistName: yup.string().required("Please select a playlist"),
  newPlaylistName: yup.string().when("playlistName", {
    is: "new",
    then: yup.string().required("Please enter a new playlist name"),
  }),
});

const AddToPlaylist: FC<PropsType> = ({ contentId, contentType }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([
    { playlistId: 0, playlistName: "" },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    if (open) {
      const getPlaylists = async () => {
        try {
          const apiUrl =
            contentType === "audio"
              ? "/api/get-audio-playlist"
              : "/api/get-video-playlist";
          const response = await axios.get(apiUrl, { withCredentials: true });
          if (response.status === 200) {
            setPlaylists(response.data);
          }
        } catch (error) {
          console.error(`Error fetching ${contentType} playlists:`, error);
        }
      };
      getPlaylists();
    }
  }, [contentType, open]);

  const handleClickDialog = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handlePlaylistChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPlaylist(e.target.value as string);
  };

  const handleNewPlaylistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlaylist("new");
  };

  const addToPlaylist = async (data: FormData) => {
    try {
      const apiUrl =
        contentType === "audio"
          ? "/api/add-playlist-content-audio"
          : "/api/add-playlist-content-video";
      const response = await axios.post(
        apiUrl,
        {
          contentId,
          playlistName: data.playlistName,
          newPlaylistName: data.newPlaylistName,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Added to playlist");
        setOpen(false);
      }
    } catch (error: any) {
      handleError(error);
      setOpen(false);
    }
  };

  const handleError = (error: AxiosError) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = (error.response.data as { message: string }).message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Button
        variant="text"
        color="primary"
        onClick={handleClickDialog}
        sx={{ mb: 2 }}
      >
        <BookmarksIcon />
      </Button>
      <Dialog open={open} onClose={handleClickDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          Add to playlist
          <IconButton
            aria-label="close"
            onClick={handleClickDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container sx={{ padding: "20px" }}>
            <form onSubmit={handleSubmit(addToPlaylist)}>
              <TextField
                id="playlistName"
                label="Category"
                select
                {...register("playlistName")}
                fullWidth
                variant="outlined"
                margin="normal"
                onChange={handlePlaylistChange}
                error={!!errors.playlistName}
                helperText={errors.playlistName?.message}
              >
                {playlists.map((playlist) => (
                  <MenuItem
                    key={playlist.playlistId}
                    value={playlist.playlistName}
                  >
                    {playlist.playlistName}
                  </MenuItem>
                ))}
                <MenuItem value="new">New Playlist</MenuItem>
              </TextField>
              {selectedPlaylist === "new" && (
                <TextField
                  id="newPlaylistName"
                  label="New Playlist Name"
                  {...register("newPlaylistName")}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  onChange={handleNewPlaylistChange}
                  error={!!errors.newPlaylistName}
                  helperText={errors.newPlaylistName?.message}
                />
              )}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Add to playlist
              </Button>
            </form>
          </Container>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddToPlaylist;
