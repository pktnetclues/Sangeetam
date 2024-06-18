import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Function to ensure destination folder exists
function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

// Function to determine destination folder dynamically based on file type
function getDestination(req, file, cb) {
  let folderName = "others"; // Default folder name

  // Determine folder name based on file's MIME type
  if (file.mimetype.startsWith("image")) {
    folderName = "thumbnails";
  } else if (file.mimetype.startsWith("audio")) {
    folderName = "audios";
  } else if (file.mimetype.startsWith("video")) {
    folderName = "videos";
  }

  const destination = `./public/assets/${folderName}/`;
  ensureFolderExists(destination);
  cb(null, destination);
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: getDestination,
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const fileName = path.basename(file.originalname);
    const filename = `${uniqueSuffix}-${fileName}`;
    cb(null, filename);
  },
});

// Function to check file types
function checkFileType(file, cb) {
  // Define allowed file types
  const allowedTypes = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "video/mp4": "mp4",
  };

  console.log(file.mimetype);

  // Check if file's MIME type is in the allowed types
  if (Object.keys(allowedTypes).includes(file.mimetype)) {
    // Check file extension against expected extension for the MIME type
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname.includes(allowedTypes[file.mimetype])) {
      cb(null, true); // File type is allowed
    } else {
      cb(`Error: Invalid file extension for ${file.fieldname}`);
    }
  } else {
    cb(`Error: Unsupported file type for ${file.fieldname}`);
  }
}

// Configure multer middleware
const fileMiddleware = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);

export default fileMiddleware;
