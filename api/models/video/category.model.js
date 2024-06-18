import sequelize from "../../utils/sequelize.js";
import { DataTypes, Model } from "sequelize";

class Category extends Model {}

Category.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "categories",
    modelName: "Category",
  },
);

// Category.sync({ force: true }).then(() => {
//   console.log("Category model synchronized");
// });

export default Category;
