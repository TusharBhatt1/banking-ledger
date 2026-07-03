import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model.js";
import { AccountModel } from "../models/account.model.js";
import mongoose from "mongoose";
import { LedgerModel } from "../models/ledger.model.js";

export async function createTransactionController(req: Request, res: Response) {
	try {
		const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

		if (!fromAccount || !toAccount || !amount) {
			return res.status(400).json({
				message: "fromAccount, toAccount, amount are required",
			});
		}

		const [existingTransaction] = await TransactionModel.find({
			idempotencyKey,
		});

		if (existingTransaction) {
			return res.status(409).json({
				message: `Transaction with idempotencyKey : ${idempotencyKey} exists`,
				status: existingTransaction.status,
			});
		}

		const accounts = await AccountModel.find({
			_id: { $in: [fromAccount, toAccount] },
		});

		if (accounts.length < 2) {
			return res.status(404).json({
				message: "Make sure both accounts exists.",
			});
		}

		if (!accounts.every((a) => a.status === "ACTIVE")) {
			return res.status(400).json({
				message: "Make sure both accounts are ACTIVE.",
			});
		}
		//@ts-ignore
		if (!req.user.systemUser) {
			//@ts-ignore
			const fromAccountBalance = await accounts[0].getBalance();

			if (fromAccountBalance < amount) {
				return res.status(400).json({
					message: `Insufficent balance in sender's account, current balance is ${fromAccountBalance} and send amount is ${amount}`,
				});
			}
		}

		/*
		CREATE TRANSACTION - create a transaction + debit ledger entry + credit ledger entry + transaction status updated + transaction end
		*/

		const session = await mongoose.startSession();
		const { id: tId } = await TransactionModel.create({
			fromAccount,
			toAccount,
			amount,
			idempotencyKey,
			status: "PENDING",
		});
		try {
			await session.withTransaction(async () => {
				await LedgerModel.create(
					[
						{
							account: fromAccount,
							type: "DEBIT",
							amount,
							transaction: tId,
						},
					],
					{
						session,
					},
				);
				await LedgerModel.create(
					[
						{
							account: toAccount,
							type: "CREDIT",
							amount,
							transaction: tId,
						},
					],
					{
						session,
					},
				);

				await TransactionModel.findByIdAndUpdate(
					tId,
					{
						$set: { status: "COMPLETED" },
					},
					{
						session,
					},
				);

				return res.status(201).json({
					message: `Transaction completed successfully with ID: ${tId}`,
				});
			});
		} catch (error) {
			await TransactionModel.findByIdAndUpdate(
				tId,
				{
					$set: { status: "REVERSED" },
				},
				{
					session,
				},
			);
			return res.status(500).json({
				message:
					error instanceof Error ? error.message : "Something went wrong",
			});
		} finally {
			await session.endSession();
		}

		return res;
	} catch (error) {
		return res.status(400).json({
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
}
