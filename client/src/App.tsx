import { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { ContextProvider } from "./context/Context";
import { ConfirmProvider } from "material-ui-confirm";
import LoaderIcon from "./components/common/Loader";

const AdminRoutes = lazy(() => import("./components/admin/AdminRoutes"));
const UserRoutes = lazy(() => import("./components/user/UserRoutes"));
const Users = lazy(() => import("./components/admin/Users"));
const PendingUsers = lazy(() => import("./components/admin/PendingUsers"));
const Audios = lazy(() => import("./components/admin/Audios"));
const Videos = lazy(() => import("./components/admin/Videos"));
const Homepage = lazy(() => import("./components/user/Homepage"));
const AllAudios = lazy(() => import("./components/user/AllAudios"));
const AllVideos = lazy(() => import("./components/user/AllVideos"));
const PendingVideos = lazy(() => import("./components/admin/PendingVideos"));
const PendingAudios = lazy(() => import("./components/admin/PendingAudio"));
const Playlist = lazy(() => import("./components/user/Playlist"));
const AudioPlaylistDetail = lazy(
  () => import("./components/user/AudioPlaylistDetail")
);
const VideoPlaylistDetail = lazy(
  () => import("./components/user/VideoPlaylistDetail")
);
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
          <Suspense fallback={<LoaderIcon />}>
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
                <Route
                  path="/user/playlist/audio/:playlistId"
                  element={<AudioPlaylistDetail />}
                />
                <Route
                  path="/user/playlist/video/:playlistId"
                  element={<VideoPlaylistDetail />}
                />
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
