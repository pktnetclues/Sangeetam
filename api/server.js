import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import sequelize from "./utils/sequelize.js";
configDotenv();

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ message: "I am good" });
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoutes);

sequelize;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
