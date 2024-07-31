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

export async function sendProjectCreatedEmail(
	first_name: string,
	project_name: string,
	creator_name: string,
	email: string
) {
	const htmlBody = `<h1 className="text-primary">Project Created</h1>
	<p>Dear ${first_name},</p>
	<p>Project <strong>${project_name}</strong> was created by <strong>${creator_name}</strong>.</p>
	<p>You are one of the team members added to this project.</p>
	<p>Best regards,</p>
	<p>Checkpoint</p>`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: "New project",
		html: htmlBody,
	});
}

export async function sendAssignTaskEmail(
	taskName: string,
	first_name: string,
	createdBy: string,
	projectName: string,
	dueDate: string,
	email: string
) {
	const htmlBody = `
	<h1>${taskName}</h1>
	<p>Dear ${first_name}</p>
	<p>You were assigned this task by ${createdBy}</p>
	<p>Project: <strong>${projectName}</strong></p>
	<p>Task Status: <strong>Todo</strong></p>
	<p>The due date for the task is: ${dueDate}</p>
	<p>Best regards,</p>
	<p>Checkpoint</p>`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: `New task creator for project ${projectName}`,
		html: htmlBody,
	});
}

export async function sendStatusChangeEmail(
	task_name: string,
	project_name: string,
	updated_by: string,
	status: string,
	first_name: string,
	email: string
) {
	const htmlBody = `
	<h1>Task Status Updated</h1>
	<p>Dear ${first_name},</p>
	<p>Project: <strong>${project_name}</strong></p>
	<p>Task Name: <strong>${task_name}</strong></p>
	<p>Updated By: <strong>${updated_by}</strong></p>
	<p>New Status: <strong>${status}</strong></p>
	<p>Best regards,</p>
	<p>Checkpoint</p>
	`;

	await transporter.sendMail({
		from: process.env.MAIL_USER,
		to: email,
		subject: `Status updated for task ${task_name}`,
		html: htmlBody,
	});
}
