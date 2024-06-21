import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addContentToPlaylist,
  createPlaylist,
  getAllPlaylistsByUser,
  getAudioContentByPlaylistId,
} from "../controllers/audio.playlist.controller.js";

const audioPlaylistRoutes = express.Router();

audioPlaylistRoutes
  .route("/create-playlist")
  .post(authMiddleware, createPlaylist);

audioPlaylistRoutes
  .route("/add-playlist-content")
  .post(authMiddleware, addContentToPlaylist);

audioPlaylistRoutes
  .route("/get-audio-playlist")
  .get(authMiddleware, getAllPlaylistsByUser);

audioPlaylistRoutes
  .route("/get-playlist-audios/:playlistId")
  .get(authMiddleware, getAudioContentByPlaylistId);

export default audioPlaylistRoutes;
