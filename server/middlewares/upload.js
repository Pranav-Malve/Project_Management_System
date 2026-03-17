import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadpath;

    if (req.route.path.include("/upload/:projectId")) {
      uploadpath = path.join(
        __dirname,
        "../uploads/projects",
        req.params.projectId,
      );
    } else if (req.route.path.include("/upload/:userId")) {
      uploadpath = path.join(__dirname, "../uploads/users", req.params.userId);
    } else {
      uploadpath = path.join(__dirname, "uploads/temp");
    }

    ensureDirExists(uploadpath);
    cd(null, uploadpath);
  },

  filename: (req, file, cd) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cd(null, `${file.filename}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-rar",
    "application/vnd.rar",
    "application/octet-stream",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
    "application/javascript",
    "text/css",
    "text/html",
    "application/json",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".txt",
    ".js",
    ".css",
    ".html",
    ".json",
  ];

  const fileExt = path.extname(file.originalname).toLocaleLowerCase();

  if (
    allowedTypes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExt)
  ) {
    cd(null, true);
  } else {
    cb(
      new Error(
        "Invalid File type. only PDF, DOC, DOCX, PPTX, ZIP, RAR, IMAGES and code files are allowed",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
    files: 10,
  },
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. maximum size is 10 mb",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files. Maximum 10 files allowed.",
      });
    }

    if (err.message && err.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }
  next(err);
};

export { upload, handleUploadError };
