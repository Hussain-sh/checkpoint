"use server";

import { hashPassword } from "@/utils/services/hashPassword";
import pool from "@/utils/postgres";
import { updatePasswordQuery } from "@/app/dbQueries/user-management";
import { redirect } from "next/navigation";

interface UpdatePasswordParams {
	newPassword: string;
	confirmPassword: string;
	token: string;
}

export async function updatePasswordAction({
	newPassword,
	confirmPassword,
	token,
}: UpdatePasswordParams) {
	if (newPassword !== confirmPassword) {
		return {
			success: false,
			type: "password",
			message: "Passwords do not match",
		};
	}

	const client = await pool.connect();
	try {
		const hashedPassword = await hashPassword(newPassword);
		const result = await client.query(updatePasswordQuery, [
			hashedPassword,
			token,
		]);
		if (result.rowCount === 0) {
			return {
				success: false,
				type: "token",
				message: "Invalid token or token has expired",
			};
		}

		return {
			success: true,
			message: "Password updated successfully!",
		};
	} catch (error) {
		console.error("Error saving password");
	} finally {
		client.release();
	}
}
