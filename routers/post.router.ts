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

// POST http://localhost:3000/api/v1/post
router.post("/", verifyToken, createPost);
router.get("/", getAllPosts);
router.get("/:id", getById);
router.get("/author/:id", getPostsByAuthor);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deleteById);
export default router;
