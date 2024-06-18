import express from "express";
import fileMiddleware from "../middlewares/file.middleware.js";
import {
  deleteAudio,
  editAudio,
  getAllAudios,
  uploadAudio,
} from "../controllers/audio.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const audioRoutes = express.Router();

audioRoutes
  .route("/upload-audio")
  .post(authMiddleware, fileMiddleware, uploadAudio);

audioRoutes.route("/all-audios").get(authMiddleware, getAllAudios);

audioRoutes.route("/edit-audio").put(authMiddleware, fileMiddleware, editAudio);

audioRoutes.route("/delete-audio/:audioId").patch(authMiddleware, deleteAudio);

export default audioRoutes;
