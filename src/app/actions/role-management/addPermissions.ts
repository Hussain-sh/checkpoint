"use server";
import { addPermissionsQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export async function addPermissions(
	roleId: number | null,
	permissionId: number
) {
	const client = await pool.connect();
	try {
		const result = await client.query(addPermissionsQuery, [
			roleId,
			permissionId,
		]);
		const permissions = result.rows;
		return {
			message: "Permissions assigned successfully",
			permissions,
		};
	} catch (error) {
		console.error("Error adding permissions:", error);
	} finally {
		client.release();
	}
}
