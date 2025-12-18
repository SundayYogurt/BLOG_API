import { Router } from "express";
const router = Router();

import { register, login } from "../controllers/user.controller";

// POST http://localhost:3000/api/v1/user/register , login
router.post("/register", register);
router.post("/login", login);

export default router;
