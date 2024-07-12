"use server";
import { getRoleNameByRoleIdQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";

export default async function getRoleNameByRoleId(roleId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getRoleNameByRoleIdQuery, [roleId]);
		const roleName = result.rows[0].role_name;
		return roleName;
	} catch (error) {
		console.error("Error fetching role id:", error);
	} finally {
		client.release();
	}
}
