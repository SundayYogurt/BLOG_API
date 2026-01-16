import { Router } from "express";
const router = Router();

import {
  createPost,
  getAllPosts,
  getById,
  getPostsByAuthor,
  updatePost,
  deleteById,
} from "../controllers/post.controller";
import { verifyToken } from "../middleware/authJwt.middleware";
import { upload, uploadToFirebase} from "../middleware/file.middleware"

// POST http://localhost:3000/api/v1/post
router.post("/", verifyToken, upload, uploadToFirebase, createPost);
router.get("/", getAllPosts);
router.get("/:id", getById);
router.get("/author/:id", getPostsByAuthor);
router.put("/:id", verifyToken, upload, uploadToFirebase, updatePost);
router.delete("/:id", verifyToken, deleteById);
export default router;
