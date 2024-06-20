import sequelize from "../../utils/sequelize.js";
import { DataTypes, Model } from "sequelize";
import User from "../auth/user.model.js";
import AudioModel from "../audio/audio.model.js";
import VideoModel from "../video/video.model.js";

class AudioPlaylist extends Model {}
class VideoPlaylist extends Model {}
class AudioPlaylist_Content extends Model {}
class VideoPlaylist_Content extends Model {}

// Define AudioPlaylist model
AudioPlaylist.init(
  {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    playlistName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "audio_playlist",
    modelName: "AudioPlaylist",
  }
);

// Define VideoPlaylist model
VideoPlaylist.init(
  {
    playlistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    playlistName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "video_playlist",
    modelName: "VideoPlaylist",
  }
);

// Define AudioPlaylist_Content model
AudioPlaylist_Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AudioPlaylist,
        key: "playlistId",
      },
    },
    audioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AudioModel,
        key: "audioId",
      },
    },
  },
  {
    sequelize,
    tableName: "audio_playlist_content",
    modelName: "AudioPlaylist_Content",
  }
);

// Define VideoPlaylist_Content model
VideoPlaylist_Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VideoPlaylist,
        key: "playlistId",
      },
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VideoModel,
        key: "videoId",
      },
    },
  },
  {
    sequelize,
    tableName: "video_playlist_content",
    modelName: "VideoPlaylist_Content",
  }
);

// Define associations
AudioPlaylist_Content.belongsTo(AudioPlaylist, { foreignKey: "playlistId" });
AudioPlaylist_Content.belongsTo(AudioModel, {
  foreignKey: "audioId",
  as: "audio",
});

VideoPlaylist_Content.belongsTo(VideoPlaylist, { foreignKey: "playlistId" });
VideoPlaylist_Content.belongsTo(VideoModel, {
  foreignKey: "videoId",
  as: "video",
});

// VideoPlaylist.sync({ force: true });
// VideoPlaylist_Content.sync({ force: true });

export {
  AudioPlaylist,
  VideoPlaylist,
  AudioPlaylist_Content,
  VideoPlaylist_Content,
};
