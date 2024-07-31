"use server";
import {
	addProjectTeamQuery,
	deleteProjectTeambyProjectIdQuery,
} from "@/app/dbQueries/project-management";
import pool from "@/utils/postgres";

export async function deleteProjectTeams(project_id: number) {
	const client = await pool.connect();
	try {
		await client.query(deleteProjectTeambyProjectIdQuery, [project_id]);
	} catch (error) {
		console.error("Error adding project", error);
	} finally {
		client.release();
	}
}
export async function editProjectTeam(
	project_id: number,
	user_id: string | null,
	projectManager: string
) {
	const [first_name] = projectManager.split(" ");
	const client = await pool.connect();
	try {
		await client.query(addProjectTeamQuery, [project_id, user_id, first_name]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error adding project", error);
	} finally {
		client.release();
	}
}
