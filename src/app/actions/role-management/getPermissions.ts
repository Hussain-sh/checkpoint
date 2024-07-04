"use server";
import { getPermissionsQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export async function getPermissions() {
	const client = await pool.connect();
	try {
		const result = await client.query(getPermissionsQuery);
		const permissions = result.rows;
		return permissions;
	} catch (error) {
		console.error("Error fetching permissions:", error);
	} finally {
		client.release();
	}
}
