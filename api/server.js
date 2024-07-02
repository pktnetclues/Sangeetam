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

import audioPlaylistRoutes from "./routes/audio.playlist.routes.js";
import videoPlaylistRoutes from "./routes/video.playlist.routes.js";
configDotenv();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the '/public/assets' directory
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/assets", express.static(join(__dirname, "public", "assets")));

app.use(cookieParser());
app.use(
  "/api",
  userRoutes,
  audioRoutes,
  videoRoutes,
  audioPlaylistRoutes,
  videoPlaylistRoutes
);
import IP from "ip";
import Geo from "geoip-lite";
app.get("/", (req, res) => {
  const ipAddress = IP.address("public", "ipv6");
  const geo = Geo.lookup(ipAddress);
  console.log(geo);
  res.send(geo);
});

sequelize;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
