import mongoose from "mongoose";
import type { Request, Response } from "express";
import PostModel from "../models/post.model";
import UserModel from "../models/user.model";

/**
 * =====================
 * Types
 * =====================
 */

type PostBody = {
  title?: string;
  summary?: string;
  content?: string;
};

export type AuthedRequest = Request<
  { id?: string },
  {},
  PostBody
> & {
  coverUrl?: string;
  user?: {
    authorId: string;
    username: string;
  };
};

/**
 * =====================
 * CREATE POST
 * =====================
 */

export const createPost = async (
  req: AuthedRequest,
  res: Response
) => {
  try {
    const { title, summary, content } = req.body ?? {};
    const authorId = req.user?.authorId;

    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.coverUrl) {
      return res.status(400).json({ message: "image is required" });
    }

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const authorExists = await UserModel.exists({ _id: authorId });
    if (!authorExists) {
      return res.status(404).json({ message: "Author not found" });
    }

    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: req.coverUrl,
      author: authorId,
    });

    return res.status(201).json(postDoc);
  } catch (error) {
    console.error("createPost error:", error);
    return res
      .status(500)
      .json({ message: "server error at method create post" });
  }
};

/**
 * =====================
 * GET ALL POSTS
 * =====================
 */

export const getAllPosts = async (
  _req: Request,
  res: Response
) => {
  try {
    const posts = await PostModel.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(posts);
  } catch (error) {
    console.error("getAllPosts error:", error);
    return res.status(500).json({ message: "error to get all posts" });
  }
};

/**
 * =====================
 * GET POST BY ID
 * =====================
 */

export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await PostModel.findById(id).populate(
      "author",
      "username"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("getById error:", error);
    return res.status(500).json({ message: "error to get post by id" });
  }
};

/**
 * =====================
 * GET POSTS BY AUTHOR
 * =====================
 */

export const getPostsByAuthor = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid author id" });
    }

    const posts = await PostModel.find({ author: id }).populate(
      "author",
      "username"
    );

    return res.json(posts);
  } catch (error) {
    console.error("getPostsByAuthor error:", error);
    return res
      .status(500)
      .json({ message: "error to get post by Author" });
  }
};

/**
 * =====================
 * UPDATE POST
 * =====================
 */

export const updatePost = async (
  req: AuthedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, summary, content } = req.body;
    const authorId = req.user?.authorId;

    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(!id){
      return res.status(400).json({ message: "id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (
      title === undefined &&
      summary === undefined &&
      content === undefined
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required" });
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, author: authorId },
      { title, summary, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found or not owned by this author",
      });
    }

    return res.json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("updatePost error:", error);
    return res.status(500).json({ message: "error to update post" });
  }
};

/**
 * =====================
 * DELETE POST
 * =====================
 */

export const deleteById = async (
  req: AuthedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const authorId = req.user?.authorId;

    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!id){
      return res.status(400).json({ message: "id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const deletedPost = await PostModel.findOneAndDelete({
      _id: id,
      author: authorId,
    });

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found or not owned by this author",
      });
    }

    return res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(500).json({ message: "error to delete post" });
  }
};
