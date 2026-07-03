import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AccountModel } from "./account.model.js";
export const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required for creating a user"],
		},
		email: {
			type: String,
			required: [true, "Email is required for creating a user"],
			trim: true,
			lowercase: true,
			unique: [true, "Email already exists."],
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Please fill a valid email address",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required for creating a user"],
			minlength: [8, "Password must be at least 8 characters long"],
			match: [
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				"At least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
			],
			select: false,
		},
		systemUser: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		await AccountModel.deleteMany({ post: this._id });
	},
);

userSchema.methods.comparePassword = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model("user", userSchema);
