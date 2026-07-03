import { Request, Response } from "express";
import { AccountModel } from "../models/account.model.js";

async function createAccountController(req: Request, res: Response) {
	//@ts-ignore
	const userId = req.user._id;

	const account = await AccountModel.create({
		user: userId,
	});

	return res.status(201).json({
		message: "Account created successfully",
		account,
	});
}

async function getAllAccountsController(req: Request, res: Response) {
	//@ts-ignore
	const { _id: userId } = req.user;
	const accounts = await AccountModel.find({
		user: userId,
	}).populate("user");

	return res.json({
		message: `Account fetched with userID ${userId}`,
		data: accounts,
	});
}

async function getAccountBalanceController(req: Request, res: Response) {
	const { accountId } = req.params;
	//@ts-ignore
	const { _id: userId } = req.user;

	const account = await AccountModel.findOne({
		_id: accountId,
		user: userId,
	}).populate("user");

	if (!account) {
		return res.status(404).json({
			message: "No account found with the accountID for this user",
		});
	}
	//@ts-ignore
	const finalBalance = await account.getBalance();

	return res.status(200).json({
		message: `Account found with account ID: ${account._id}`,
		finalBalance,
		data: account,
	});
}

export {
	createAccountController,
	getAllAccountsController,
	getAccountBalanceController,
};
