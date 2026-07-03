import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { BlackListTokenModel } from "../models/black-listed-token.model.js";

export async function authMiddleWare(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const token = req.cookies["bank-ledger"];
	if (!token) {
		return res.status(401).json({
			message: "Token not found",
		});
	}

	try {
		const [isBlackListedToken] = await BlackListTokenModel.find({
			token,
		});

		if (isBlackListedToken) {
			return res.status(403).json({
				message:
					"Unauthorized, token is backlisted now, please try login again",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
			userId: string;
		};

		const user = await UserModel.findById(decoded.userId).select("+systemUser");
		if (!user) {
			return res.status(404).json({
				message: "User not found ",
			});
		}
		//@ts-ignore
		req.user = user;
		return next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({
			message: "Token expired, unauthorised token",
		});
	}
}
