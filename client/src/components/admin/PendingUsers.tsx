import { useEffect, useState } from "react";
import { UserType } from "../../types";
import axios from "axios";
import {
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

const PendingUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [approveOpen, setApproveOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

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

  const approveOrReject = async (email: string, action: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/approve-user",
        {
          email,
          action,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.message);
        getUsers();
        open ? handleDialog() : handleApproveDialog();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDialog = () => {
    setOpen(!open);
  };

  const handleApproveDialog = () => {
    setApproveOpen(!approveOpen);
  };

  return (
    <div
      style={{
        marginLeft: 250,
        padding: 20,
      }}
    >
      {users.length > 0 ? (
        <>
          <div>
            <Typography
              sx={{
                padding: 1,
              }}
            >
              Pending Users
            </Typography>
          </div>
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="end"
                      >
                        <>
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
                            <DialogTitle id="alert-dialog-title">
                              Reject User Registration
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to reject the user. once
                                done user will be removed from database
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button disabled={loading} onClick={handleDialog}>
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  approveOrReject(user.email, "reject")
                                }
                                autoFocus
                                disabled={loading}
                              >
                                {loading ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  "Reject"
                                )}
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                        <>
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
                            <DialogTitle id="alert-dialog-title">
                              Approve User Registration
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to approve the user.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                disabled={loading}
                                onClick={handleApproveDialog}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  approveOrReject(user.email, "approve")
                                }
                                autoFocus
                                disabled={loading}
                              >
                                {loading ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography>Not any pending users</Typography>
      )}
    </div>
  );
};

export default PendingUsers;
