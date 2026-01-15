import multer from "multer";
import path from "path";
import { bucket } from "../config/firebase.admin";
import "dotenv/config";
// multer memory upload (field: cover)

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
console.log(sa.private_key);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1_000_000 }, // 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("cover");

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) return cb(null, true);
  return cb(new Error("Images only! (jpeg, jpg, png, gif, webp)"));
}

// middleware: upload to firebase and attach url to req
export async function uploadToFirebase(req: any, res: any, next: any) {
  if (!req.file) return next();

  try {
    const safeName = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(`uploads/${safeName}`);
    
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();

    req.coverUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    next();
  } catch (err) {
    console.error("Firebase upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}


