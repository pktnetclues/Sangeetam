import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { AudioType } from "../../types";
import CloseIcon from "@mui/icons-material/Close";

const validationSchema = yup.object().shape({
  album: yup.string().required("Album is required"),
  singerName: yup.string().required("Singer name is required"),
  writerName: yup.string().required("Writer name is required"),
  media: yup
    .mixed()
    .notRequired()
    .test("fileSize", "Audio file should be less than 10MB", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 1024 * 1024 * 50;
    })
    .test("fileType", "Only audio files are allowed", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type.includes("audio");
    }),
  thumbnail: yup
    .mixed()
    .notRequired()
    .test("fileSize", "Image should be less than 5MB", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 1024 * 1024 * 5;
    })
    .test("fileType", "Only images are allowed", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type.includes("image");
    }),
});

interface UploadAudioProps {
  audioDetails: AudioType;
  callAudios: () => void;
}

const EditAudio: React.FC<UploadAudioProps> = ({
  audioDetails,
  callAudios,
}) => {
  const [mediaFile, setMediaFile] = useState<FileList | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickDialog = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      album: audioDetails.album,
      singerName: audioDetails.singerName,
      writerName: audioDetails.writerName,
    },
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("audioId", audioDetails.audioId);
    formData.append("album", data.album);
    formData.append("singerName", data.singerName);
    formData.append("writerName", data.writerName);
    if (mediaFile) {
      formData.append("media", mediaFile[0]);
    }
    if (thumbnailFile) {
      formData.append("image", thumbnailFile[0]);
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/edit-audio`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (response.status === 200) {
        reset();
        toast.success("Audio Updated");
        callAudios();
        handleClickDialog();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating post:", error);
      toast.error("Failed to update audio");
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailFile(e.target.files);
    }
  };

  return (
    <Box>
      <Button variant="outlined" color="primary" onClick={handleClickDialog}>
        Edit Audio
      </Button>
      <Dialog open={open} onClose={handleClickDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Audio
          <IconButton
            aria-label="close"
            onClick={handleClickDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
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
            maxWidth="xs">
            <form
              name="form"
              style={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                padding: "20px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
              onSubmit={handleSubmit(handleFormSubmit)}>
              <TextField
                id="album"
                label="Album"
                error={!!errors.album}
                helperText={errors.album?.message}
                {...register("album")}
                fullWidth
                variant="outlined"
                margin="none"
              />

              <TextField
                id="singerName"
                label="Singer Name"
                error={!!errors.singerName}
                helperText={errors.singerName?.message}
                {...register("singerName")}
                fullWidth
                variant="outlined"
                margin="normal"
              />

              <TextField
                id="writerName"
                label="Writer Name"
                error={!!errors.writerName}
                helperText={errors.writerName?.message}
                {...register("writerName")}
                fullWidth
                variant="outlined"
                margin="normal"
              />

              <TextField
                id="media"
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.media}
                helperText={errors.media?.message}
                onChange={handleMediaChange}
                inputProps={{ ...register("media") }}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Upload audio file"
              />
              <Typography>Update Audio File (If you want the new)</Typography>

              <TextField
                id="thumbnail"
                type="file"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.thumbnail}
                helperText={errors.thumbnail?.message}
                onChange={handleThumbnailChange}
                inputProps={{ ...register("thumbnail") }}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Upload thumbnail image"
              />
              <Typography
                sx={{
                  mb: 2,
                }}>
                Upload Thumbnail Image File(If you want the new)
              </Typography>

              {!loading ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth>
                  Update
                </Button>
              ) : (
                <Button variant="contained" color="primary" disabled fullWidth>
                  Updating...
                </Button>
              )}
            </form>
          </Container>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EditAudio;
