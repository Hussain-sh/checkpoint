"use server";
import { getUserDetailsQuery } from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";

export default async function getUserDetails(id: string) {
	const client = await pool.connect();
	try {
		const result = await client.query(getUserDetailsQuery, [id]);
		const userData = result.rows[0];
		return userData;
	} catch (error) {
		console.error("Error fetching users", error);
	} finally {
		client.release();
	}
}
