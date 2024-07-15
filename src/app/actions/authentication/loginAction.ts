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
				errors: [{ field: "email" }],
			};
		}

		const user = result.rows[0];
		const isPasswordValid = await verifyPassword(password, user.password);

		//Check if password is a valid password
		if (!isPasswordValid) {
			return {
				success: false,
				errors: [{ field: "password" }],
			};
		}

		// Check if email is verified
		if (!user.is_email_verified) {
			return {
				success: false,
				errors: [
					{
						field: "verification",
					},
				],
			};
		}

		// user deactivated
		if (!user.is_active) {
			return {
				success: false,
				errors: [
					{
						field: "email",
					},
				],
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
