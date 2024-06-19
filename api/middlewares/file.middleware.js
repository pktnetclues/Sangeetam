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

function checkFileType(file, cb) {
  // Define allowed file types
  const allowedTypes = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/jpg": ["jpg"],
    "image/webp": ["webp"],
    "image/png": ["png"],
    "audio/mp3": ["mp3"],
    "audio/mpeg": ["mp3"],
    "video/mp4": ["mp4"],
  };

  // Get the file extension and remove the leading dot
  const extname = path.extname(file.originalname).toLowerCase().slice(1);

  // Log file MIME type and extension for debugging
  console.log(`MIME type: ${file.mimetype}`);
  console.log(`File extension: ${extname}`);

  // Check if file's MIME type is in the allowed types
  if (allowedTypes[file.mimetype]) {
    // Check file extension against expected extensions for the MIME type
    if (allowedTypes[file.mimetype].includes(extname)) {
      cb(null, true); // File type is allowed
    } else {
      cb(
        new Error(
          `Error: Invalid file extension for ${
            file.fieldname
          }. Expected ${allowedTypes[file.mimetype].join(
            " or "
          )}, but got ${extname}.`
        )
      );
    }
  } else {
    cb(new Error(`Error: Unsupported file type for ${file.fieldname}`));
  }
}

// Configure multer middleware
const fileMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "media", maxCount: 1 },
]);

export default fileMiddleware;
