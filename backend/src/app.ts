import "dotenv/config";
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { PREFIX_ROUTES } from "./config/constants.js";
import { CONNECT_TO_DB } from "./config/db.js";
import { accountRouter } from "./routes/account.routes.js";
import { transactionRouter } from "./routes/transaction.routes.js";
import { logoutRouter } from "./routes/logout.routes.js";

const port = process.env.PORT ?? 3001;
const app = express();

app.use(express.json());
app.use(cookieparser());

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// ROUTES
app.use("/", (_, res) => {
	res.send("Ledger backend up and running");
});

app.use(PREFIX_ROUTES.authRouter, authRouter);
app.use(PREFIX_ROUTES.accountRouter, accountRouter);
app.use(PREFIX_ROUTES.transactionRouter, transactionRouter);
app.use(PREFIX_ROUTES.logoutRouter, logoutRouter);

async function START_SERVER() {
	app.listen(port, () => {
		console.log(`SERVER STARTED AT PORT: ${port}`);

		CONNECT_TO_DB();
	});
}

export { START_SERVER };
