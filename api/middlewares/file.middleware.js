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

// Function to determine destination folder dynamically based on the field name
function getDestination(req, file, cb) {
  console.log("fielanmef", file.fieldName);
  const fieldName = file.fieldName;

  let folderName = "";
  if (fieldName === "mp3") {
    folderName = "audios";
  } else if (fieldName === "image/jpeg") {
    folderName = "thumbnails";
  } else if (fieldName === "mp4") {
    folderName = "videos";
  } else {
    fieldName = "others";
  }

  const destination = `./public/assets/${folderName}/`;
  ensureFolderExists(destination);
  cb(null, destination);
}

// Set storage
const storage = multer.diskStorage({
  destination: getDestination,
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const fileName = path.basename(file.originalname);
    const filename = `${uniqueSuffix}-${fileName}`;
    cb(null, filename);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed filetypes
  const filetypes = /mp4|mp3|jpeg|jpg|png/;
  // Check the extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Only ");
  }
}

const fileMiddleware = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("files", 2);

export default fileMiddleware;
