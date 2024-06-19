import { CircularProgress } from "@mui/material";
import { useUser } from "../../context/Context";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserRoutes: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <CircularProgress />;
  }

  return user?.email ? (
    <>
      <Sidebar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default UserRoutes;
