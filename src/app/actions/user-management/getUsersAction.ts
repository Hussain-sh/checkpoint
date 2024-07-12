"use server";

import { getUsersQuery } from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";

export default async function getUsers() {
	const client = await pool.connect();
	try {
		const result = await client.query(getUsersQuery);
		const userData = result.rows;
		return userData;
	} catch (error) {
		console.error("Error fetching users", error);
	} finally {
		client.release();
	}
}
