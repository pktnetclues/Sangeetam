import React, { useEffect, useState } from "react";
import { UserType } from "../../types";
import axios from "axios";
import {
  Avatar,
  Box,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

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
        setUsers(response.data.users);
      }
    } catch (error) {}
  };
  return (
    <div
      style={{
        marginLeft: 250,
      }}
    >
      <List>
        {users?.map((user) => (
          <ListItem
            key={user.userId}
            sx={{
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Users;
