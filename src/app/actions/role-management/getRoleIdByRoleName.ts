"use server";
import { getRoleIdByRoleNameQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export async function getRoleIdByRoleName(roleName: string) {
	const client = await pool.connect();
	try {
		const result = await client.query(getRoleIdByRoleNameQuery, [roleName]);
		const roleId = result.rows[0];
		return roleId;
	} catch (error) {
		console.error("Error fetching role id:", error);
	} finally {
		client.release();
	}
}
