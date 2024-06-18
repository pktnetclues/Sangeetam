import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import sequelize from "./utils/sequelize.js";
import cors from "cors";
import audioRoutes from "./routes/audio.routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import videoRoutes from "./routes/video.routes.js";
configDotenv();

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ message: "I am good" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static assets from the '/public/assets' directory
app.use("/assets", express.static(join(__dirname, "public", "assets")));

console.log(__dirname + "/public/assets");
app.use(cookieParser());
app.use("/api", userRoutes, audioRoutes, videoRoutes);

sequelize;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
