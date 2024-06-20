import {
  AudioPlaylist,
  AudioPlaylist_Content,
} from "../models/playlist/playlist.model.js";
import {
  createPlaylistContentSchema,
  createPlaylistSchema,
} from "../schema/user.schema.js";
import AudioModel from "../models/audio/audio.model.js";

const createPlaylist = async (req, res) => {
  try {
    await createPlaylistSchema.validate(req.body);

    const { playlistName } = req.body;
    const { userId } = req.user;

    const newPlaylist = await AudioPlaylist.create({
      userId,
      playlistName,
    });

    return res.status(200).json(newPlaylist);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating playlist:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the playlist" });
  }
};

const addContentToPlaylist = async (req, res) => {
  try {
    await createPlaylistContentSchema.validate(req.body);

    const { playlistName, audioId } = req.body;
    const { userId } = req.user;

    let playlist = await AudioPlaylist.findOne({
      where: { userId, playlistName },
    });
    if (!playlist) {
      playlist = await AudioPlaylist.create({ userId, playlistName });
    }

    const newContent = await AudioPlaylist_Content.create({
      playlistId: playlist.playlistId,
      audioId,
    });

    return res.status(200).json(newContent);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error adding content to playlist:", error);
    return res.status(500).json({
      error: "An error occurred while adding content to the playlist",
    });
  }
};

const getAllPlaylistsByUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const playlists = await AudioPlaylist.findAll({ where: { userId } });

    return res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching playlists" });
  }
};

const getAudioContentByPlaylistId = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const audioContent = await AudioPlaylist_Content.findAll({
      where: { playlistId },
      include: [
        {
          model: AudioModel,
          as: "audio",
          // attributes: ["audioId", "album", "artist"],
        },
      ],
    });

    return res.status(200).json(audioContent);
  } catch (error) {
    console.error("Error fetching audio content:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching audio content" });
  }
};

export {
  createPlaylist,
  addContentToPlaylist,
  getAllPlaylistsByUser,
  getAudioContentByPlaylistId,
};
