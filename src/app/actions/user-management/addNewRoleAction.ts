"use server";
import { addNewRoleQuery } from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";

export default async function addNewRole(roleName: string) {
	const client = await pool.connect();
	try {
		// Add role and return role_id
		const addRoleResult = await client.query(addNewRoleQuery, [roleName]);
		const roleId = addRoleResult.rows[0].id;
		return {
			roleId,
			success: true,
		};
	} catch (error) {
		console.error("Error adding role", error);
	} finally {
		client.release();
	}
}
