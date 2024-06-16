import { CircularProgress } from "@mui/material";
import { useUser } from "../../context/Context";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { toast } from "sonner";

const AdminRoutes: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <CircularProgress />;
  }

  if (user?.isAdmin === false) {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/" />;
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

export default AdminRoutes;
