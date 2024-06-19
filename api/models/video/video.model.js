import sequelize from "../../utils/sequelize.js";
import { DataTypes, Model } from "sequelize";
import User from "../auth/user.model.js";
import Category from "./category.model.js";

class VideoModel extends Model {}

VideoModel.init(
  {
    videoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING(500),
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
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "categoryId",
      },
    },
  },
  {
    sequelize,
    tableName: "videos",
    modelName: "VideoModel",
  }
);

VideoModel.belongsTo(User, { foreignKey: "uploadedBy" });
VideoModel.belongsTo(Category, { foreignKey: "categoryId" });

// VideoModel.sync({ force: true }).then(() => {
//   console.log("VideoModel created");
// });

export default VideoModel;
