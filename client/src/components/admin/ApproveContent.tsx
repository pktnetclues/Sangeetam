import {
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast } from "sonner";

const ApproveContent = ({ contentType, contentId, getContents }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  const approveOrReject = async (
    contentId: number,
    contentType: string,
    action: string
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/approve-content",
        {
          contentId,
          contentType,
          action,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        getContents();
        setLoading(false);
        toast.success(response.data.message);
        open ? handleDialog() : handleApproveDialog();
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred");
    }
  };

  const handleDialog = () => {
    setOpen(!open);
  };

  const handleApproveDialog = () => {
    setApproveOpen(!approveOpen);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <div>
        <Button onClick={handleDialog}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              color: "red",
            }}
          >
            Reject <CloseIcon />
          </Typography>
        </Button>
        <Dialog
          open={open}
          onClose={handleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Reject Content</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reject this content? Once done, it will
              be removed from the database.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={handleDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => approveOrReject(contentId, contentType, "reject")}
              autoFocus
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Reject"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Button onClick={handleApproveDialog}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              color: "green",
            }}
          >
            Approve <DoneAllIcon />
          </Typography>
        </Button>
        <Dialog
          open={approveOpen}
          onClose={handleApproveDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Approve Content</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to approve this content?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={handleApproveDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => approveOrReject(contentId, contentType, "approve")}
              autoFocus
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Approve"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Stack>
  );
};

export default ApproveContent;
