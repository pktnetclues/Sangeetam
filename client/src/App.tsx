import { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { ContextProvider } from "./context/Context";
import AdminRoutes from "./components/admin/AdminRoutes";
import UserRoutes from "./components/user/UserRoutes";
import Users from "./components/admin/Users";
import PendingUsers from "./components/admin/PendingUsers";
import Audios from "./components/admin/Audios";
import Videos from "./components/admin/Videos";
import { ConfirmProvider } from "material-ui-confirm";
import Homepage from "./components/user/Homepage";
import AllAudios from "./components/user/AllAudios";
import AllVideos from "./components/user/AllVideos";
import PendingVideos from "./components/admin/PendingVideos";
import Playlist from "./components/user/Playlist";
import PendingAudios from "./components/admin/PendingAudio";

const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgetPassword = lazy(() => import("./components/auth/ForgetPassword"));
const ChangePassword = lazy(() => import("./components/auth/ChangePassword"));

function App() {
  return (
    <ContextProvider>
      <ConfirmProvider>
        <Router>
          <CssBaseline />
          <Toaster position="top-center" duration={2000} />
          <Suspense fallback={<CircularProgress />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route element={<AdminRoutes />}>
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/pending-users" element={<PendingUsers />} />
                <Route path="/admin/audios" element={<Audios />} />
                <Route path="/admin/videos" element={<Videos />} />
                <Route
                  path="/admin/pending-videos"
                  element={<PendingVideos />}
                />
                <Route
                  path="/admin/pending-audios"
                  element={<PendingAudios />}
                />
              </Route>
              <Route element={<UserRoutes />}>
                <Route path="/user/home" element={<Homepage />} />
                <Route path="/user/audios" element={<AllAudios />} />
                <Route path="/user/videos" element={<AllVideos />} />
                <Route path="/user/playlist" element={<Playlist />} />
              </Route>
              <Route path="/*" element={<h1>Not Found</h1>} />
            </Routes>
          </Suspense>
        </Router>
      </ConfirmProvider>
    </ContextProvider>
  );
}

export default App;
