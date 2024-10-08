"use server";
import {
	getArchivedProjectsQuery,
	getProjectDetailsQuery,
	getProjectPrioritiesQuery,
	getProjectsQuery,
	getProjectStagesQuery,
	getRecentProjectsQuery,
	getRecentTasksQuery,
	getTasksByProjectIdQuery,
	getTeamMembersFromProjectIdQuery,
	getUsersByProjectQuery,
	getUsersByRoleQuery,
	getUsersWithViewProjectPermissionsQuery,
} from "@/app/dbQueries/project-management";
import pool from "@/utils/postgres";

export default async function getProjectPriorities() {
	const client = await pool.connect();
	try {
		const result = await client.query(getProjectPrioritiesQuery);
		const projectPriorities = result.rows;
		return projectPriorities;
	} catch (error) {
		console.error("Error fetching priorities", error);
	} finally {
		client.release();
	}
}

export async function getProjectManagers() {
	const client = await pool.connect();
	const roleId = 2;
	try {
		const result = await client.query(getUsersByRoleQuery, [roleId]);
		const projectManagers = result.rows;
		return projectManagers;
	} catch (error) {
		console.error("Error fetching project managers", error);
	} finally {
		client.release();
	}
}

export async function getUsersWithViewProjectPermissions() {
	const client = await pool.connect();
	const roleId = 3;
	try {
		const result = await client.query(getUsersWithViewProjectPermissionsQuery);
		const users = result.rows;
		return users;
	} catch (error) {
		console.error("Error fetching developers", error);
	} finally {
		client.release();
	}
}

export async function getDevelopersByProjectId(projectId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getUsersByProjectQuery, [projectId]);
		const developers = result.rows;
		return developers;
	} catch (error) {
		console.error("Error fetching developers", error);
	} finally {
		client.release();
	}
}

export async function getProjectDetails(projectId: number | null) {
	const client = await pool.connect();
	try {
		const result = await client.query(getProjectDetailsQuery, [projectId]);
		const projectDetails = result.rows[0];
		return projectDetails;
	} catch (error) {
		console.error("Error fetching developers", error);
	} finally {
		client.release();
	}
}

export async function getTeamMembersFromProjectId(projectId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getTeamMembersFromProjectIdQuery, [
			projectId,
		]);
		const teamMembers = result.rows;
		return teamMembers;
	} catch (error) {
		console.error("Error fetching developers", error);
	} finally {
		client.release();
	}
}

export async function getAllProjects() {
	const client = await pool.connect();
	try {
		const result = await client.query(getProjectsQuery);
		const projects = result.rows;
		return projects;
	} catch (error) {
		console.error("Error fetching projects", error);
	} finally {
		client.release();
	}
}

export async function getArchivedProjects() {
	const client = await pool.connect();
	try {
		const result = await client.query(getArchivedProjectsQuery);
		const projects = result.rows;
		return projects;
	} catch (error) {
		console.error("Error fetching projects", error);
	} finally {
		client.release();
	}
}

export async function getProjectStages() {
	const client = await pool.connect();
	try {
		const result = await client.query(getProjectStagesQuery);
		const project_stages = result.rows;
		return project_stages;
	} catch (error) {
		console.error("Error fetching projects", error);
	} finally {
		client.release();
	}
}

export async function getRecentProjects(user_id: number, role_id: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getRecentProjectsQuery, [
			user_id,
			role_id,
		]);
		const recent_projects = result.rows;
		return recent_projects;
	} catch (error) {
		console.error("Error fetching recent projects", error);
	} finally {
		client.release();
	}
}

export async function getRecentTasks(user_id: number, role_id: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getRecentTasksQuery, [user_id, role_id]);
		const recent_tasks = result.rows;
		return recent_tasks;
	} catch (error) {
		console.error("Error fetching recent projects", error);
	} finally {
		client.release();
	}
}

export async function getTasksByProjectId(project_id: number | null) {
	const client = await pool.connect();
	try {
		const result = await client.query(getTasksByProjectIdQuery, [project_id]);
		const tasks = result.rows;
		return tasks;
	} catch (error) {
		console.error("Error fetching recent projects", error);
	} finally {
		client.release();
	}
}
