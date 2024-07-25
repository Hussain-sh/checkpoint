"use server";
import {
	deleteProjectQuery,
	deleteProjectTeambyProjectIdQuery,
} from "@/app/dbQueries/project-management";
import pool from "@/utils/postgres";

export async function deleteProject(project_id: number | null) {
	const client = await pool.connect();
	try {
		// await client.query(deleteProjectTeambyProjectIdQuery, [project_id]);
		await client.query(deleteProjectQuery, [project_id]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error adding project", error);
	} finally {
		client.release();
	}
}
