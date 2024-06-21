import {
  VideoPlaylist,
  VideoPlaylist_Content,
} from "../models/playlist/playlist.model.js";
import {
  createPlaylistContentSchema,
  createPlaylistSchema,
} from "../schema/user.schema.js";
import VideoModel from "../models/video/video.model.js";

const createVideoPlaylist = async (req, res) => {
  try {
    await createPlaylistSchema.validate(req.body);

    const { playlistName } = req.body;
    const { userId } = req.user;

    const newPlaylist = await VideoPlaylist.create({
      userId,
      playlistName,
    });

    return res.status(200).json(newPlaylist);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating video playlist:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the video playlist" });
  }
};

const addVideoContentToPlaylist = async (req, res) => {
  try {
    await createPlaylistContentSchema.validate(req.body);

    const { playlistName, videoId } = req.body;
    const { userId } = req.user;

    let playlist = await VideoPlaylist.findOne({
      where: { userId, playlistName },
    });
    if (!playlist) {
      playlist = await VideoPlaylist.create({ userId, playlistName });
    }

    const newContent = await VideoPlaylist_Content.create({
      playlistId: playlist.playlistId,
      videoId,
    });

    return res.status(200).json(newContent);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error adding content to video playlist:", error);
    return res.status(500).json({
      error: "An error occurred while adding content to the video playlist",
    });
  }
};

const getAllVideoPlaylistsByUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const playlists = await VideoPlaylist.findAll({ where: { userId } });

    return res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching video playlists:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching video playlists" });
  }
};

const getVideoContentByPlaylistId = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const videoContent = await VideoPlaylist_Content.findAll({
      where: { playlistId },
      include: [
        {
          model: VideoModel,
          as: "video",
          // attributes: ["videoId", "title", "creator"],
        },
      ],
    });

    return res.status(200).json(videoContent);
  } catch (error) {
    console.error("Error fetching video content:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching video content" });
  }
};

export {
  createVideoPlaylist,
  addVideoContentToPlaylist,
  getAllVideoPlaylistsByUser,
  getVideoContentByPlaylistId,
};
