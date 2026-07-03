import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "account",
		index: true,
		immutable: true,
		required: [true, "Ledger must be associate with a account"],
	},
	amount: {
		type: Number,
		required: [true, "Transaction must have a type - CREDIT or DEBIT"],
		immutable: true,
	},
	transaction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "transaction",
		required: [true, "Transaction must have a type - CREDIT or DEBIT"],
		immutable: true,
		index: true,
	},
	type: {
		type: String,
		enum: {
			values: ["CREDIT", "DEBIT"],
		},
		required: [true, "Transaction must have a type - CREDIT or DEBIT"],
	},
});

ledgerSchema.index({ account: 1, transaction: 1 });

function preventLedgerModification() {
	throw new Error("Ledger entries are immutable");
}

ledgerSchema.pre("save", function () {
	if (!this.isNew) {
		preventLedgerModification();
	}
});

ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);

export const LedgerModel = mongoose.model("ledger", ledgerSchema);
