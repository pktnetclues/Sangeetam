import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import { useConfirm } from "material-ui-confirm";

interface Props {
  audioId: number;
  getAudios: () => void;
}

const DeleteAudio: React.FC<Props> = ({ audioId, getAudios }) => {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/delete-audio/${audioId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Audio deleted successfully");
        getAudios();
      }
    } catch (error) {
      toast.error("Failed to delete audio");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    confirm({ description: "Are you sure you want to delete this audio?" })
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
      {loading ? <CircularProgress size={24} /> : "Delete Audio"}
    </Button>
  );
};

export default DeleteAudio;
