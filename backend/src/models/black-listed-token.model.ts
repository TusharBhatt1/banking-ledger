import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: [true, "Token is must that'll be blacklisted"],
		unique: true,
	},
	expiresAt: {
		type: Date,
		required: [true, "expiresAt is required"],
		expires: 0, // instructs DB  to create a TTL index
	},
});

blackListTokenSchema.index({ token: 1 });

export const BlackListTokenModel = mongoose.model(
	"black-list-token",
	blackListTokenSchema,
);
