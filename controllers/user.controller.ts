import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// typescirpt บังคับเช็ค
const JWT_SECRET = process.env.SECRET;
if (!JWT_SECRET) {
  throw new Error("SECRET is not defined in .env");
}

// กำหนด type ให้ req.body ? = อาจมี หรืออาจไม่มี
type AuthBody = {
  username?: string;
  password?: string;
};

export const register = async (req: Request<{}, {}, AuthBody>, res: Response) => {
  try {
    const { username, password } = req.body ?? {};
    // 1) validate
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 2) check duplicate
    const existing = await UserModel.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 3) hash + create
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, password: hashedPassword });

    // กัน leak รหัสผ่านกลับไป
    return res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request<{}, {}, AuthBody>, res: Response) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: userDoc.username, id: userDoc._id.toString() },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successfully",
      id: userDoc._id,
      username: userDoc.username,
      accessToken: token,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message ?? "Some error occurred while logging in user" });
  }
};
