import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface PropsType {
  contentId: number;
  contentType: "audio" | "video";
}

interface FormData {
  playlistName: string;
  newPlaylistName: string;
}

interface Playlist {
  playlistId: number;
  playlistName: string;
}

const validationSchema = yup.object().shape({
  playlistName: yup.string().required("Please select a playlist"),
  newPlaylistName: yup.string().when("playlistName", {
    is: "new",
    then: (schema) => schema.required("Please enter a new playlist name"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddToPlaylist: FC<PropsType> = ({ contentId, contentType }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      playlistName: "",
      newPlaylistName: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const watchPlaylistName = watch("playlistName");

  useEffect(() => {
    if (open) {
      const getPlaylists = async () => {
        try {
          const apiUrl = `/api/get-${contentType}-playlist`;
          const response = await axios.get<Playlist[]>(apiUrl, {
            withCredentials: true,
          });
          setPlaylists(response.data);
        } catch (error) {
          console.error(`Error fetching ${contentType} playlists:`, error);
          toast.error(`Failed to fetch ${contentType} playlists`);
        }
      };
      getPlaylists();
    }
  }, [contentType, open]);

  const handleClickDialog = () => setOpen((prevOpen) => !prevOpen);

  const addToPlaylist = async (data: FormData) => {
    try {
      const apiUrl = `/api/add-playlist-content-${contentType}`;
      const payload = {
        contentId,
        playlistName:
          data.playlistName === "new"
            ? data.newPlaylistName
            : data.playlistName,
      };
      const response = await axios.post(apiUrl, payload, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Added to playlist");
        setOpen(false);
      }
    } catch (error) {
      handleError(error as AxiosError);
    }
  };

  const handleError = (error: AxiosError) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    toast.error(errorMessage);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <IconButton onClick={handleClickDialog}>
        <BookmarksIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClickDialog} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Typography variant="h6">Add to Playlist</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClickDialog}
            sx={{ color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(addToPlaylist)}>
            <Controller
              name="playlistName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Select Playlist"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.playlistName}
                  helperText={errors.playlistName?.message}>
                  {playlists.map((playlist) => (
                    <MenuItem
                      key={playlist.playlistId}
                      value={playlist.playlistName}>
                      {playlist.playlistName}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">New Playlist</MenuItem>
                </TextField>
              )}
            />
            {watchPlaylistName === "new" && (
              <Controller
                name="newPlaylistName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="New Playlist Name"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.newPlaylistName}
                    helperText={errors.newPlaylistName?.message}
                  />
                )}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}>
              Add to Playlist
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddToPlaylist;
