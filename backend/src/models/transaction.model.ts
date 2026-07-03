import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		fromAccount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "account",
			required: [true, "Transaction must be associate with a from account"],
			index: true,
		},
		toAccount: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "account",
			required: [true, "Transaction must be associate with a to account"],
		},
		status: {
			type: String,
			enum: {
				values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
			},
			required: [
				true,
				"Transaction must have a status - PENDING, COMPLETED, FAILED, REVERSED",
			],
		},
		amount: {
			type: Number,
			required: [true, "Transaction must have a amount"],
			immutable: true,
		},
		idempotencyKey: {
			type: String,
			required: [true, "IdempotencyKey is required"],
			unique: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

transactionSchema.pre("save", async function () {
	const idempotencyKeyExists = await TransactionModel.findOne({
		idempotencyKey: this.idempotencyKey,
	});

	if (idempotencyKeyExists) {
		throw new Error(
			`Idempotency key already exists with status: ${idempotencyKeyExists.status}`,
		);
	}
});
export const TransactionModel = mongoose.model(
	"transaction",
	transactionSchema,
);
