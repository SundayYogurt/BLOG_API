import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config()
const secret = process.env.SECRET
import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    /* 1. validate */
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    /* 2. เช็กซ้ำ */
    const existing = await UserModel.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    /* 3. hash + create */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await UserModel.create({ username, password: hashedPassword });

    return res.json({ message: 'User created successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.login = async (req:Request, res:Response) => {

}