"use server";
import { getSelectedRolePermissionsQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export default async function getSelectedRolePermissions(roleId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getSelectedRolePermissionsQuery, [
			roleId,
		]);
		const permissions = result.rows;
		return permissions;
	} catch (error) {
		console.error("Error fetching permissions:", error);
	} finally {
		client.release();
	}
}
