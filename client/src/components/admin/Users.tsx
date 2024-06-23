import { useEffect, useState } from "react";
import { UserType } from "../../types";
import axios from "axios";
import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteUser from "./DeleteUser";
import UpdateUserStatus from "./UserStatus";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/all-users", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {}
  };

  return (
    <div
      style={{
        marginLeft: 250,
        padding: 20,
      }}>
      {users.length > 0 ? (
        <>
          <div>
            <Typography
              variant="h5"
              sx={{
                padding: 1,
              }}>
              All Users
            </Typography>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Delete User</TableCell>
                  <TableCell align="right">Sataus</TableCell>
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
                      <DeleteUser
                        user={user}
                        getUsers={getUsers}
                        key={user.userId}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <UpdateUserStatus
                        key={user.userId}
                        user={user}
                        getUsers={getUsers}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Alert severity="info">No users found.</Alert>
      )}
    </div>
  );
};

export default Users;
