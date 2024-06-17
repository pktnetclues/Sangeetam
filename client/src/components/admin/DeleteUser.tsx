import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "sonner";

const DeleteUser: React.FC = ({ user, getUsers }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/delete-user",
        {
          name: user.name,
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        handleDialog();
        setLoading(false);
        getUsers();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDialog = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <Button variant="text" onClick={handleDialog}>
        <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this user
        </DialogTitle>

        <DialogActions>
          <Button disabled={loading} onClick={handleDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete()}
            disabled={loading}
            variant="contained"
            autoFocus
          >
            {loading ? <CircularProgress size={24} /> : "Delete anyway"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteUser;
