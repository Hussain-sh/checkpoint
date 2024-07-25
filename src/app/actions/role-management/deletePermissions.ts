"use server";
import { deletePermissionsQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";

export async function deletePermissionsByRoleId(roleId: number | null) {
	const client = await pool.connect();
	try {
		await client.query(deletePermissionsQuery, [roleId]);
	} catch (error) {
		console.error("Error adding permissions:", error);
	} finally {
		client.release();
	}
}
