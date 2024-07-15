"use server";
import { updateRoleQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";

export default async function updateRole(roleName: string, id: number) {
	const client = await pool.connect();
	try {
		// Add role and return role_id
		await client.query(updateRoleQuery, [roleName, id]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error adding role", error);
	} finally {
		client.release();
	}
}
