import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { logoutUserController } from "../controllers/logout.controller.js";

export const logoutRouter = express.Router();

logoutRouter.post("/",authMiddleWare,logoutUserController)
