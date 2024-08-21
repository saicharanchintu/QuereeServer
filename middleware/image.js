import multer from "multer";
import path from "path";
const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Absolute path for destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      "uploaded_image_" + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

export const upload = multer({ storage });