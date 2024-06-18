import AudioModel from "../models/audio/audio.model.js";
import { audioSchema } from "../schema/user.schema.js";
import Yup from "yup";

const uploadAudio = async (req, res) => {
  try {
    await audioSchema.validate(req.body, { abortEarly: false });

    const { album, singerName, writerName } = req.body;

    const uploadedBy = req.user.userId;

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

    await AudioModel.create({
      album,
      singerName,
      writerName,
      uploadedBy,
      audioUrl,
      thumbnail,
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAudios = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(200).json({ message: "you are not authorized" });
    }

    const fetchAudios = await AudioModel.findAll({
      where: {
        isApproved: true,
      },
    });

    return res.status(200).json(fetchAudios);
  } catch (error) {}
};

export { uploadAudio, getAllAudios };
