import sequelize from "../../utils/sequelize";
import { DataTypes, Model } from "sequelize";
import User from "../auth/user.model";

class AudioModel extends Model {}

AudioModel.init(
  {
    audioId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    album: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    audioUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    singerName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    writerName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "audios",
    modelName: "AudioModel",
  }
);

export default AudioModel;
