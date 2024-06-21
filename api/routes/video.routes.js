import express from "express";
import {
  deleteVideo,
  editVideo,
  getAllVideos,
  getCategories,
  getPendingVideos,
  uploadVideo,
} from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import fileMiddleware from "../middlewares/file.middleware.js";

const videoRoutes = express.Router();

videoRoutes
  .route("/upload-video")
  .post(authMiddleware, fileMiddleware, uploadVideo);

videoRoutes.route("/all-videos").get(authMiddleware, getAllVideos);

videoRoutes.route("/pending-videos").get(authMiddleware, getPendingVideos);

videoRoutes.route("/edit-video").put(authMiddleware, fileMiddleware, editVideo);

videoRoutes.route("/delete-video/:videoId").patch(authMiddleware, deleteVideo);

videoRoutes.route("/categories").get(authMiddleware, getCategories);

export default videoRoutes;
