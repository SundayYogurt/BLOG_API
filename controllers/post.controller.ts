import PostModel from "../models/post.model";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import type { AuthedRequest } from "../middleware/authJwt.middleware";
type PostBody = {
  title?: string;
  summary?: string;
  content?: string;
  cover?: string;
  author?: string; // ถ้าเป็น ref ObjectId แนะนำให้ส่งเป็น id string
};

// POST /api/v1/posts
export const createPost = async (
  req: Request<{}, {}, PostBody>,
  res: Response
) => {
  const { title, summary, content, cover, author } = req.body ?? {};

  if (!title || !summary || !content || !cover || !author) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate author reference to avoid saving posts that cannot populate
  const isValidAuthorId = mongoose.Types.ObjectId.isValid(author);
  if (!isValidAuthorId) {
    return res.status(400).json({ message: "Invalid author id" });
  }

  const authorExists = await UserModel.exists({ _id: author });
  if (!authorExists) {
    return res.status(404).json({ message: "Author not found" });
  }

  try {
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover,
      author,
    });

    return res.status(201).json(postDoc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error at method create post" });
  }
};

// GET /api/v1/posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const allPosts = await PostModel.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(allPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error to get all posts" });
  }
};

// GET /api/v1/posts/:id
export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    if(!id){
        res.send(404).json({message : "Id not found"})
    }
    const post = await PostModel.findById(id).populate("author", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error to get post by id" });
  }
};

export const getPostsByAuthor = async ( req: Request<{id: string}>, res:Response) => {
     const { id } = req.params;
    try {
    if(!id){
        res.status(404).json({message: "Author not found"})
    }
    const posts = await PostModel.find({ author : id}).populate("author",["username"])

    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error to get post by Author" });
  }
};


export const updatePost = async (
  req: AuthedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, summary, content, cover } = req.body;

  
    if (title === undefined && summary === undefined && content === undefined && cover === undefined) {
      return res.status(400).json({ message: "At least one field is required" });
    }
     const author = req.user?.authorId;
     

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, author},                      
      { title, summary, content, cover },       
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found or not owned by this author" });
    }

    return res.status(200).json({message: `Post updated successfully`});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error to update post" });
  }
};


export const deleteById  = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params; 
  
  const author = req.user?.authorId;

  if(!author){
    res.status(404).json({message : "Author not found"})
  }
  if(!id){
    res.status(404).json({message : "PostId not found"})
  }
    try {
      const deletedPost = await PostModel.findOneAndDelete({author, _id:id});
        if (deletedPost) {
          return res.json({ message: "Post deleted successfully", result: deletedPost});
        } else {
          return res.status(404).json({ message: `Can't delete post with id: ${id}.` });
        }
    } catch (error) {
      res.status(500).json({ message: "error to delete post" });
    }
  
  
  }
