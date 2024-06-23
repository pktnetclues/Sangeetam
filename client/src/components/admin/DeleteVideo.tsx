import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import { useConfirm } from "material-ui-confirm";

interface Props {
  videoId: number;
  getVideos: () => void;
}

const DeleteVideo: React.FC<Props> = ({ videoId, getVideos }) => {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/delete-video/${videoId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Video deleted successfully");
        getVideos();
      }
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    confirm({ description: "Are you sure you want to delete this video?" })
      .then(() => {
        handleDelete();
      })
      .catch(() => {
        console.log("Deletion cancelled");
      });
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleConfirmDelete}
      disabled={loading}>
      {loading ? <CircularProgress size={24} /> : "Delete Video"}
    </Button>
  );
};

export default DeleteVideo;
