import Yup from "yup";
import VideoModel from "../models/video/video.model.js";
import Category from "../models/video/category.model.js";
import { videoSchema } from "../schema/user.schema.js";
import User from "../models/auth/user.model.js";

const uploadVideo = async (req, res) => {
  try {
    await videoSchema.validate(req.body, { abortEarly: false });

    const { title, categoryId } = req.body;

    const uploadedBy = req.user.userId;
    const isAdmin = req.user.isAdmin;

    if (req.fileValidationError) {
      return res.status(400).json({
        message: "File validation failed",
        error: req.fileValidationError,
      });
    }

    if (!req.files || !req.files["image"] || !req.files["media"]) {
      return res
        .status(400)
        .json({ message: "Thumbnail and video files are required." });
    }

    const thumbnail = req.files["image"][0].filename;
    const videoUrl = req.files["media"][0].filename;

    let isApproved = false;
    if (isAdmin) {
      isApproved = true;
    }

    await VideoModel.create({
      title,
      videoUrl,
      uploadedBy,
      thumbnail,
      isApproved,
      categoryId,
    });

    return res.status(200).json({ message: "Video uploaded successfully" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    // const { isAdmin } = req.user;

    // if (!isAdmin) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const videos = await VideoModel.findAll({
      where: {
        isApproved: true,
        isDeleted: false,
      },
      include: [
        {
          model: Category,
          attributes: ["categoryName", "categoryId"],
        },
        {
          model: User,
          attributes: ["userId", "name"],
        },
      ],
      attributes: {
        exclude: ["categoryId", "isDeleted"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingVideos = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const videos = await VideoModel.findAll({
      where: {
        isApproved: false,
        isDeleted: false,
      },
      include: [
        {
          model: Category,
          attributes: ["categoryName", "categoryId"],
        },
        {
          model: User,
          attributes: ["userId", "name"],
        },
      ],
      attributes: {
        exclude: ["categoryId", "isDeleted"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editVideo = async (req, res) => {
  try {
    await videoSchema.validate(req.body, { abortEarly: false });

    const { videoId, title } = req.body;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const video = await VideoModel.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (req.fileValidationError) {
      return res.status(400).json({
        message: "File validation failed",
        error: req.fileValidationError,
      });
    }

    if (req.files?.["thumbnail"]) {
      video.thumbnail = req.files["thumbnail"][0].filename;
    }
    if (req.files?.["video"]) {
      video.videoUrl = req.files["video"][0].filename;
    }
    if (title) {
      video.title = title;
    }
    if (isAdmin) {
      video.isApproved = true;
    }

    await video.save();

    return res.status(200).json({ message: "Video updated successfully" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const video = await VideoModel.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.isDeleted = true;
    await video.save();

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["categoryName", "ASC"]],
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  uploadVideo,
  getAllVideos,
  getPendingVideos,
  editVideo,
  deleteVideo,
  getCategories,
};
