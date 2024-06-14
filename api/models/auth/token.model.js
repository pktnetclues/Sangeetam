import sequelize from "../../utils/sequelize.js";
import { DataTypes } from "sequelize";

const forgetPassToken = sequelize.define("token_password", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  token: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// forgetPassToken.sync();

export default forgetPassToken;
