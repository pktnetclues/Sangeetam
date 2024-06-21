import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addVideoContentToPlaylist,
  createVideoPlaylist,
  getAllVideoPlaylistsByUser,
  getVideoContentByPlaylistId,
} from "../controllers/video.playlist.controller.js";

const videoPlaylistRoutes = express.Router();

videoPlaylistRoutes
  .route("/create-playlist")
  .post(authMiddleware, createVideoPlaylist);

videoPlaylistRoutes
  .route("/add-playlist-content")
  .post(authMiddleware, addVideoContentToPlaylist);

videoPlaylistRoutes
  .route("/get-video-playlist")
  .get(authMiddleware, getAllVideoPlaylistsByUser);

videoPlaylistRoutes
  .route("/get-playlist-videos/:playlistId")
  .get(authMiddleware, getVideoContentByPlaylistId);

export default videoPlaylistRoutes;
