import AudioModel from "../models/audio/audio.model.js";
import VideoModel from "../models/video/video.model.js";
import { audioSchema } from "../schema/user.schema.js";
import Yup from "yup";
import { contentUploadEmailToAdmin, sendEmail } from "../utils/mail.js";

const uploadAudio = async (req, res) => {
  try {
    await audioSchema.validate(req.body, { abortEarly: false });

    const { album, singerName, writerName } = req.body;

    const uploadedBy = req.user.userId;
    const { isAdmin, name, email } = req.user;

    if (req.fileValidationError) {
      return res.status(400).json({
        message: "File validation failed",
        error: req.fileValidationError,
      });
    }

    if (!req.files || !req.files["image"] || !req.files["media"]) {
      return res
        .status(400)
        .json({ message: "Image and media files are required." });
    }

    // Access uploaded file names
    const thumbnail = req.files["image"][0].filename;
    const audioUrl = req.files["media"][0].filename;

    if (!isAdmin) {
      await AudioModel.create({
        album,
        singerName,
        writerName,
        uploadedBy,
        audioUrl,
        thumbnail,
      });

      await sendEmail({
        email: process.env.GMAIL_ID,
        subject: "Content Upload Request",
        mailgenContent: contentUploadEmailToAdmin({
          name: name,
          email: email,
          contentType: "audio",
        }),
      });

      return res.status(200).json({ message: "success" });
    } else {
      await AudioModel.create({
        album,
        singerName,
        writerName,
        uploadedBy,
        audioUrl,
        thumbnail,
        isApproved: true,
      });
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingAudios = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const videos = await AudioModel.findAll({
      where: {
        isApproved: false,
        isDeleted: false,
      },

      attributes: {
        exclude: ["isDeleted"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const approveContent = async (req, res) => {
  try {
    const { isAdmin } = req.user;
    const { contentId, contentType, action } = req.body;

    if (!isAdmin) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const models = {
      audio: AudioModel,
      video: VideoModel,
    };

    const model = models[contentType];

    if (!model) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    const operations = {
      approve: { isApproved: true },
    };

    if (action === "approve") {
      await model.update(operations[action], {
        where: { [`${contentType}Id`]: contentId },
      });
    } else if (action === "reject") {
      await model.destroy({ where: { [`${contentType}Id`]: contentId } });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAudios = async (req, res) => {
  try {
    // const { isAdmin } = req.user;

    // if (!isAdmin) {
    //   return res.status(200).json({ message: "you are not authorized" });
    // }

    const fetchAudios = await AudioModel.findAll({
      where: {
        isApproved: true,
        isDeleted: false,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(fetchAudios);
  } catch (error) {}
};

const editAudio = async (req, res) => {
  try {
    // Validate the incoming request body
    await audioSchema.validate(req.body, { abortEarly: false });

    const { audioId, album, singerName, writerName } = req.body;

    // Fetch user details
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check for file validation errors
    if (req.fileValidationError) {
      return res.status(400).json({
        message: "File validation failed",
        error: req.fileValidationError,
      });
    }

    // Check if files are provided
    const thumbnail = req.files?.["image"]
      ? req.files["image"][0].filename
      : null;
    const audioUrl = req.files?.["media"]
      ? req.files["media"][0].filename
      : null;

    // Find the audio record by ID
    const audio = await AudioModel.findByPk(audioId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    // Update fields if provided
    if (album) audio.album = album;
    if (singerName) audio.singerName = singerName;
    if (writerName) audio.writerName = writerName;
    if (thumbnail) audio.thumbnail = thumbnail;
    if (audioUrl) audio.audioUrl = audioUrl;
    if (isAdmin) audio.isApproved = true;

    // Save the updated audio record
    await audio.save();

    return res.status(200).json({ message: "Audio updated successfully" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAudio = async (req, res) => {
  try {
    const audioId = req.params.audioId;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const audio = await AudioModel.findByPk(audioId);
    if (!audio) {
      return res.status(404).json({ message: "Audio not found" });
    }

    audio.isDeleted = true;
    await audio.save();

    return res.status(200).json({ message: "Audio deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  uploadAudio,
  getAllAudios,
  getPendingAudios,
  approveContent,
  editAudio,
  deleteAudio,
};
