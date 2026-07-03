import nodemailer from "nodemailer";

type SendEmailOptions = {
	to: string;
	subject: string;
	html: string;
};

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GOOGLE_CLIENT,
		pass: process.env.GOOGLE_APP_PASSWORD,
	},
});

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	return transporter.sendMail({
		from: `"Bank Ledger" <${process.env.SMTP_USER}>`,
		to,
		subject,
		html,
	});
}

export async function sendTransactionEmail(
	name: string,
	email: string,
	amount: number,
	transactionId: string,
	status: "PENDING" | "COMPLETED" | "FAILED",
) {
	return sendEmail({
		to: email,
		subject: `Transaction ${status} - Bank Ledger`,
		html: `
      <h2>Hello, ${name}! 💳</h2>

      <p>Your transaction has been <strong>${status}</strong>.</p>

      <table style="border-collapse: collapse;">
        <tr>
          <td><strong>Transaction ID:</strong></td>
          <td>${transactionId}</td>
        </tr>
        <tr>
          <td><strong>Amount:</strong></td>
          <td>₹${amount}</td>
        </tr>
        <tr>
          <td><strong>Status:</strong></td>
          <td>${status}</td>
        </tr>
      </table>

      <br />

      <p>Thank you for using <strong>Bank Ledger</strong>.</p>

      <p>— Bank Ledger Team</p>
    `,
	});
}

export async function sendRegistrationEmail(name: string, email: string) {
	return sendEmail({
		to: email,
		subject: "Welcome to Bank Ledger",
		html: `
        <h2>Welcome, ${name}! 👋</h2>
        <p>Thanks for signing up for <strong>Bank Ledger</strong>.</p>
        <p>Your account has been created successfully.</p>
        <p>We're excited to have you on board.</p>
  
        <br />
  
        <p>— Bank Ledger Team</p>
      `,
	});
}
