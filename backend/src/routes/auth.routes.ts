import express from "express";
import {
	userLoginController,
	userRegistrationController,
} from "../controllers/auth.controller.js";
export const authRouter = express.Router();

//POST: /api/auth/register
authRouter.post("/register", userRegistrationController);
authRouter.post("/login", userLoginController);
