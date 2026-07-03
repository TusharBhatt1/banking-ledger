import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { createTransactionController } from "../controllers/transaction.controller.js";
import { systemUserMiddleware } from "../middleware/transaction.middleware.js";

export const transactionRouter = express.Router();

/*
POST: /api/transaction/create
Create a new transaction
*/
transactionRouter.post("/create", authMiddleWare, createTransactionController);
transactionRouter.post(
	"/add-initial-funds",
	authMiddleWare,
	systemUserMiddleware,
	createTransactionController,
);
