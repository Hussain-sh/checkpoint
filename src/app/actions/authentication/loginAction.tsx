"use server";
import pool from "@/utils/postgres";
import { checkEmailAndPasswordQuery } from "@/app/dbQueries/user-management";
import { verifyPassword } from "@/utils/services/verifyPassword";

export async function loginAction(email: string, password: string) {
	const client = await pool.connect();
	try {
		const result = await client.query(checkEmailAndPasswordQuery, [email]);

		//Check if email exists in db
		if (result.rowCount === 0) {
			return {
				success: false,
				message: "Email not found.",
				errors: [{ field: "email", message: "Email not found." }],
			};
		}

		const user = result.rows[0];
		const isPasswordValid = await verifyPassword(password, user.password);

		//Check if password is a valid password
		if (!isPasswordValid) {
			return {
				success: false,
				message: "Invalid password.",
				errors: [{ field: "password", message: "Invalid password." }],
			};
		}

		return {
			success: true,
			errors: [],
			user,
		};
	} catch (error) {
		console.error("Error during login:", error);
		return {
			success: false,
			message: "An error occurred during login.",
			errors: [{ field: "form", message: "An error occurred during login." }],
		};
	} finally {
		client.release();
	}
}
