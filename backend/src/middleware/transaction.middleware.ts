import { NextFunction, Request, Response } from "express";

export async function systemUserMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	//@ts-ignore
	const { systemUser } = req.user;

	if (!systemUser) {
		return res.status(403).json({
			message: "This action can be done only by a System User",
		});
	}
	return next();
}
