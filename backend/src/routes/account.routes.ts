import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import {
	createAccountController,
	getAccountBalanceController,
	getAllAccountsController,
} from "../controllers/account.controller.js";

export const accountRouter = express.Router();

// GET /api/account/get-accounts
accountRouter.get(
	"/get-accounts",
	authMiddleWare,
	getAllAccountsController,
);

accountRouter.post("/create", authMiddleWare, createAccountController);
accountRouter.get("/get-account/:accountId", authMiddleWare, getAccountBalanceController);
