import mongoose from "mongoose";

async function CONNECT_TO_DB() {
	try {
		console.log("CONNECTING DB TO SERVER...");
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("DB TO SERVER CONNECTED");
	} catch (error) {
		console.error("ERROR CONNECTING DB TO SERVER...:", error);
		process.exit(1);
	}
}

export { CONNECT_TO_DB };
