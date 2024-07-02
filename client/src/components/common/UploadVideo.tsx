import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  categoryId: yup.number().required("Category ID is required"),
  media: yup
    .mixed()
    .test("fileSize", "Video file should be less than 100MB", (value: any) => {
      return value && value[0]?.size <= 1024 * 1024 * 100;
    })
    .test("fileType", "Only video files are allowed", (value: any) => {
      return value && value[0]?.type.includes("video");
    }),
  thumbnail: yup
    .mixed()
    .test("fileSize", "Image should be less than 5MB", (value: any) => {
      return value && value[0]?.size <= 1024 * 1024 * 5;
    })
    .test("fileType", "Only images are allowed", (value: any) => {
      return value && value[0]?.type.includes("image");
    }),
});

interface UploadVideoProps {
  closeDialog: () => void;
}

const UploadVideo: React.FC<UploadVideoProps> = ({ closeDialog }) => {
  const [mediaFile, setMediaFile] = useState<FileList | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryId", data.categoryId);
    if (mediaFile) {
      formData.append("media", mediaFile[0]);
    }
    if (thumbnailFile) {
      formData.append("image", thumbnailFile[0]);
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/upload-video`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (response.status === 200) {
        reset();
        toast.success("Video Uploaded");
        closeDialog();
        // callVideos();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
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
    <Container maxWidth="sm">
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            id="title"
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register("title")}
            fullWidth
            variant="outlined"
            margin="normal"
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
              <MenuItem key={category.categoryId} value={category.categoryId}>
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
          />
          <Typography>Upload Video File</Typography>

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
          />
          <Typography
            sx={{
              mb: 2,
            }}
          >
            Upload Thumbnail Image File
          </Typography>

          <div style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Upload
              </Button>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
};

export default UploadVideo;
