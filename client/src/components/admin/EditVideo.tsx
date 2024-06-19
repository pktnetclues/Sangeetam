import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { VideoType } from "../../types";
import CloseIcon from "@mui/icons-material/Close";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  categoryId: yup.string().required("Category is required"),
  media: yup
    .mixed()
    .notRequired()
    .test("fileSize", "Video file should be less than 100MB", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.size <= 1024 * 1024 * 100;
    })
    .test("fileType", "Only video files are allowed", (value: any) => {
      if (!value || value.length === 0) return true;
      return value[0]?.type.includes("video");
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

interface UploadVideoProps {
  videoDetails: VideoType;
  callVideos: () => void;
}

const EditVideo: React.FC<UploadVideoProps> = ({
  videoDetails,
  callVideos,
}) => {
  const [mediaFile, setMediaFile] = useState<FileList | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get("/api/categories", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleClickDialog = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: videoDetails.title,
      categoryId: videoDetails.categoryId,
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (videoDetails && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.id === videoDetails.categoryId
      );
      if (category) {
        setValue("categoryId", category.id);
      }
    }
  }, [videoDetails, categories, setValue]);

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("videoId", videoDetails.videoId);
    formData.append("title", data.title);
    formData.append("categoryId", data.categoryId);
    if (mediaFile) {
      formData.append("media", mediaFile[0]);
    }
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile[0]);
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/edit-video`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (response.status === 200) {
        reset();
        toast.success("Video Updated");
        callVideos();
        handleClickDialog();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
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
      <Button
        sx={{
          my: 2,
        }}
        variant="outlined"
        color="primary"
        onClick={handleClickDialog}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={handleClickDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Video
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
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <TextField
                id="title"
                label="Title"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register("title")}
                fullWidth
                variant="outlined"
                margin="none"
              />

              <TextField
                id="categoryId"
                label="Category"
                select
                error={!!errors.categoryId}
                helperText={errors.categoryId?.message}
                {...register("categoryId")}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                {categories.map((category: any) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </MenuItem>
                ))}
              </TextField>

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
                placeholder="Upload video file"
              />
              <Typography>Update Video File (If you want the new)</Typography>

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
                }}
              >
                Upload Thumbnail Image File (If you want the new)
              </Typography>

              {!loading ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
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

export default EditVideo;
