"use server";
import pool from "@/utils/postgres";
import {
	checkEmailAndPasswordQuery,
	saveForgotPasswordToken,
} from "@/app/dbQueries/user-management";
import { generateToken } from "@/utils/services/generateToken";
import { sendForgotPasswordEmail } from "@/utils/services/sendEmail";

export async function mailAction({ email }: { email: string }) {
	const client = await pool.connect();
	try {
		const result = await client.query(checkEmailAndPasswordQuery, [email]);
		const user = result.rows[0];
		if (result.rowCount === 0) {
			return {
				success: false,
				message: "Email not found.",
			};
		}

		const token = generateToken();
		await sendForgotPasswordEmail(user.email, token);
		await client.query(saveForgotPasswordToken, [token, user.email]);
		return {
			success: true,
			message: "Email Sent",
		};
	} catch (error) {
		console.error("Error sending email", error);
	} finally {
		client.release();
	}
}
