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
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

const AddToPlaylist = ({ playlists, audioId }) => {
  const [open, setOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleClickDialog = () => {
    setOpen(!open);
  };

  const handlePlaylistChange = (e) => {
    setSelectedPlaylist(e.target.value);
  };

  const handleNewPlaylistChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const addToPlaylist = async (e) => {
    try {
      e.preventDefault();
      const playlistName =
        selectedPlaylist === "new" ? newPlaylistName : selectedPlaylist;
      const response = await axios.post(
        "/api/add-playlist-content",
        {
          audioId: audioId,
          playlistName: playlistName,
        },
        {
          withCredentials: true,
        }
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
      console.log(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  return (
    <div>
      <Box>
        <Button variant="text" color="primary" onClick={handleClickDialog}>
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
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "auto",
              }}
              maxWidth="xs"
            >
              <form
                name="form"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                  padding: "20px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
                onSubmit={addToPlaylist}
              >
                <TextField
                  id="categoryId"
                  label="Category"
                  select
                  value={selectedPlaylist}
                  onChange={handlePlaylistChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
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
                    id="newPlaylist"
                    label="New Playlist Name"
                    value={newPlaylistName}
                    onChange={handleNewPlaylistChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
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
    </div>
  );
};

export default AddToPlaylist;
