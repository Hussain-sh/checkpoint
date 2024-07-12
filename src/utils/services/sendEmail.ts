import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export async function sendVerificationEmail(email: string, token: string) {
	const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?token=${token}`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: "Verify your email",
		html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
	});
}

export async function sendForgotPasswordEmail(email: string, token: string) {
	const htmlBody = `Click here to reset password <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${token}">Reset Password<a/>`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: "Reset your password",
		html: htmlBody,
	});
}

export async function sendEmailWithUserCredentials(
	firstName: string,
	email: string,
	password: string
) {
	const htmlBody = `
	<h1>Welcome to Checkpoint</h1>
	<p>Dear ${firstName},</p>
	<p>Here are your credentials:</p>
	<p><strong>Email:</strong> ${email}</p>
	<p><strong>Password:</strong> ${password}</p>
	<p>Please keep this information secure and do not share it with anyone.</p>
	<p>Best regards,</p>
	<p>Checkpoint</p>
`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: "Welcome to checkpoint",
		html: htmlBody,
	});
}
