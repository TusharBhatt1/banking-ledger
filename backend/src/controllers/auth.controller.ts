import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { sendRegistrationEmail } from "../services/email.service.js";

/**
 * - user registration controller
 * - POST /api/auth/register
 */
async function userRegistrationController(req: Request, res: Response) {
	const { name, email } = req.body;
	try {
		const isExists = await UserModel.findOne({
			email,
		});

		if (isExists) {
			return res.status(422).json({
				message: "User already exits with this email",
				status: "Failed",
			});
		}

		const user = await UserModel.create(req.body);

		const token = jwt.sign(
			{ userId: user.id, name, email },
			process.env.JWT_SECRET_KEY!,
			{
				expiresIn: "3D",
			},
		);

		res.cookie("bank-ledger", token, {
			httpOnly: true,
			sameSite: true,
		});

		await sendRegistrationEmail(user.name, user.email);

		return res.status(201).json({
			message: `User created with email: ${req.body.email}`,
		});
	} catch (error) {
		return res.status(500).json({
			message:
				error instanceof Error
					? error.message
					: "Something went wrong while registering user",
		});
	}
}

/**
 * - user login controller
 * - POST /api/auth/login
*/

async function userLoginController(req: Request, res: Response) {
	const { email, password } = req.body;

	const user = await UserModel.findOne({
		email,
	}).select("+password");

	if (!user) {
		return res.status(401).json({
			message: "Unauthorized, User don't exits with this email",
			status: "Failed",
		});
	}

	//@ts-ignore
	const validPassword = user.comparePassword(password);

	if (!validPassword) {
		return res.status(401).json({
			message: "Unauthorized, Password don't match",
			status: "Failed",
		});
	}
	const token = jwt.sign(
		{ userId: user.id, name: user.name, email },
		process.env.JWT_SECRET_KEY!,
		{
			expiresIn: "1D",
		},
	);
	res.cookie("bank-ledger", token);

	return res.status(200).json({
		message: `User successfully logged in.`,
	});
}

export { userRegistrationController, userLoginController };
