import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");

type MyJwtPayload = JwtPayload & {
  authorId: string;
  username: string;
};

export interface AuthedRequest extends Request {
  user?: { authorId: string; username: string };
}

export const verifyToken = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const token =
    req.header("x-access-token") 

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as MyJwtPayload;

    req.user = {
      authorId: decoded.id,   
      username: decoded.username,
    };

    return next();
  } catch (err) {
    return res.status(403).json({ message: "Access forbidden" });
  }
};

export default { verifyToken };
