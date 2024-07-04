"use server";

import { getProfileDetailsQuery } from "@/app/dbQueries/profile-management";
import pool from "@/utils/postgres";

export default async function getProfileDetails(email: string) {
	const client = await pool.connect();
	try {
		const result = await client.query(getProfileDetailsQuery, [email]);
		const profileDetails = result.rows[0];
		return profileDetails;
	} catch (error) {
		console.error("Error fetching profile details", error);
	} finally {
		client.release();
	}
}
