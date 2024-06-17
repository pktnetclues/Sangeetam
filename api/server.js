import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import sequelize from "./utils/sequelize.js";
import cors from "cors";
import audioRoutes from "./routes/audio.routes.js";
configDotenv();

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ message: "I am good" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", userRoutes, audioRoutes);

sequelize;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
