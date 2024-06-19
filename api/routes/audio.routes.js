import express from "express";
import fileMiddleware from "../middlewares/file.middleware.js";
import {
  approveAudio,
  deleteAudio,
  editAudio,
  getAllAudios,
  getPendingAudios,
  uploadAudio,
} from "../controllers/audio.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const audioRoutes = express.Router();

audioRoutes
  .route("/upload-audio")
  .post(authMiddleware, fileMiddleware, uploadAudio);

audioRoutes.route("/all-audios").get(authMiddleware, getAllAudios);

audioRoutes.route("/pending-audios").get(authMiddleware, getPendingAudios);

audioRoutes.route("/approve-audio/:audioId").get(authMiddleware, approveAudio);

audioRoutes.route("/edit-audio").put(authMiddleware, fileMiddleware, editAudio);

audioRoutes.route("/delete-audio/:audioId").patch(authMiddleware, deleteAudio);

export default audioRoutes;
