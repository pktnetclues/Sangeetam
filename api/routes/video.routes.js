import express from "express";
import fileMiddleware from "../middlewares/file.middleware.js";
import {
  deleteVideo,
  editVideo,
  getAllVideos,
  uploadVideo,
} from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const videoRoutes = express.Router();

videoRoutes
  .route("/upload-video")
  .post(authMiddleware, fileMiddleware, uploadVideo);

videoRoutes.route("/all-videos").get(authMiddleware, getAllVideos);

videoRoutes.route("/edit-video").put(authMiddleware, fileMiddleware, editVideo);

videoRoutes.route("/delete-video/:videoId").patch(authMiddleware, deleteVideo);

export default videoRoutes;
