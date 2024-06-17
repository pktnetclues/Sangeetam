import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const UpdateUserStatus: React.FC = ({ user, getUsers }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/change-user-status",
        {
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
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
        {user.status ? "Active" : "Inactive"}
      </Button>
      <Dialog
        open={open}
        onClose={handleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to make this user{" "}
          {user.status ? "Inactive" : "Active"}
        </DialogTitle>

        <DialogActions>
          <Button disabled={loading} onClick={handleDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => handleChangeStatus()}
            disabled={loading}
            variant="contained"
            autoFocus
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : user.status ? (
              "Deactivate User"
            ) : (
              "Activate User"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UpdateUserStatus;
