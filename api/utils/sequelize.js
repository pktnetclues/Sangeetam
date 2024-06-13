import { Sequelize } from "sequelize";

const sequelize = new Sequelize("sangeetam", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Sangeetam Connected");
  })
  .catch((err) => {
    console.log("Errror Connecting", err.original.sqlMessage);
  });

// sequelize.sync({ alter: true }).then(() => {
//   console.log("Tables created");
// });

export default sequelize;
