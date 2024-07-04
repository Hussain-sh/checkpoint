"use server";
import { getPermissionIdFromPermissionNameQuery } from "@/app/dbQueries/role-management";
import pool from "@/utils/postgres";
export default async function getPermissionIdFromPermissionName(
	permissionName: string
) {
	const client = await pool.connect();
	try {
		const result = await client.query(getPermissionIdFromPermissionNameQuery, [
			permissionName,
		]);
		const permissionId = result.rows[0];
		return permissionId;
	} catch (error) {
		console.error("Error fetching permission id:", error);
	} finally {
		client.release();
	}
}
