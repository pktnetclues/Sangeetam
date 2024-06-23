import { useEffect, useState } from "react";
import { UserType } from "../../types";
import axios from "axios";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";

// Custom hook to handle loading state
const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return { loading, startLoading, stopLoading };
};

// Dialog component
const ActionDialog = ({
  open,
  handleClose,
  action,
  userEmail,
  handleAction,
}: {
  open: boolean;
  handleClose: () => void;
  action: "approve" | "reject";
  userEmail: string;
  handleAction: (email: string, action: "approve" | "reject") => Promise<void>;
}) => {
  const { loading, startLoading, stopLoading } = useLoading();

  const handleActionClick = async () => {
    startLoading();
    await handleAction(userEmail, action);
    stopLoading();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        {action === "approve" ? "Approve" : "Reject"} User Registration
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to {action} the user?
          {action === "reject" &&
            " once done user will be removed from database"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleActionClick}
          autoFocus
          disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : action === "approve" ? (
            "Approve"
          ) : (
            "Reject"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PendingUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/pending-users", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {}
  };

  const handleUserAction = async (
    email: string,
    action: "approve" | "reject",
  ) => {
    try {
      const response = await axios.post(
        "/api/approve-user",
        {
          email,
          action,
        },
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        getUsers();
        handleDialogClose();
      }
    } catch (error) {}
  };

  const handleDialogOpen = (action: "approve" | "reject", email: string) => {
    setDialogAction(action);
    setSelectedUserEmail(email);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div style={{ marginLeft: 250, padding: 20 }}>
      <Typography variant="h5" sx={{ padding: 1 }}>
        Pending Users
      </Typography>
      {users.length > 0 ? (
        <>
          <Typography sx={{ padding: 1 }}>Pending Users</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Approve/Reject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.userId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="end">
                        <Button
                          onClick={() =>
                            handleDialogOpen("reject", user.email)
                          }>
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "red",
                            }}>
                            Reject <CloseIcon />
                          </Typography>
                        </Button>
                        <Button
                          onClick={() =>
                            handleDialogOpen("approve", user.email)
                          }>
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "green",
                            }}>
                            Approve <DoneAllIcon />
                          </Typography>
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ActionDialog
            open={dialogOpen}
            handleClose={handleDialogClose}
            action={dialogAction}
            userEmail={selectedUserEmail}
            handleAction={handleUserAction}
          />
        </>
      ) : (
        <Alert severity="info">No pending users found.</Alert>
      )}
    </div>
  );
};

export default PendingUsers;
