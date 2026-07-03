import { Request, Response } from "express";
import { BlackListTokenModel } from "../models/black-listed-token.model.js";
import jwt from "jsonwebtoken";

export async function logoutUserController(req: Request, res: Response) {
	const token = req.cookies["bank-ledger"];
	const { exp } = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
		exp: number;
	};

	const expiresAt = new Date(exp * 1000);

	await BlackListTokenModel.create({
		token,
		expiresAt,
	});

	res.cookie("bank-ledger", "");

	return res.status(201).json({ token, status: "Black Listed" });
}
