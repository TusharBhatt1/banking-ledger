import mongoose from "mongoose";
import { LedgerModel } from "./ledger.model.js";

const accountSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: [true, "Account must be associated with a user."],
			index: true,
		},
		status: {
			type: String,
			enum: {
				values: ["ACTIVE", "FROZEN", "CLOSED"],
				message: "Status can be either ACTIVE, FROZEN or CLOSED",
			},
			default: "ACTIVE",
		},
		currency: {
			type: String,
			required: [true, "Currency is required for creating an account"],
			default: "INR",
		},
	},
	{
		timestamps: true,
	},
);

//compound index
accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
	const result = await LedgerModel.aggregate([
		{
			$match: {
				account: this._id,
			},
		},
		{
			$group: {
				_id: this._id,
				balance: {
					$sum: {
						$cond: [
							{ $eq: ["$type", "CREDIT"] },
							"$amount",
							{ $multiply: ["$amount", -1] },
						],
					},
				},
			},
		},
	]);

	if(result.length===0){
		return 0
	}

	return result[0].balance;
};
export const AccountModel = mongoose.model("account", accountSchema);
