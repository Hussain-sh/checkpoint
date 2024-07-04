"use server";
import { getRolesQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export async function getRoles() {
	const client = await pool.connect();
	try {
		const result = await client.query(getRolesQuery);
		const roles = result.rows;
		return roles;
	} catch (error) {
		console.error("Error fetching roles:", error);
	} finally {
		client.release();
	}
}
