"use server";
import {
	getSubTasksQuery,
	getTaskDetailsQuery,
	getTaskPrioritiesQuery,
	getTasksByProjectIdAndAssigneeIdQuery,
	getTasksQuery,
} from "@/app/dbQueries/task-management";
import pool from "@/utils/postgres";

export default async function getTaskPriorities() {
	const client = await pool.connect();
	try {
		const result = await client.query(getTaskPrioritiesQuery);
		const taskPriorities = result.rows;
		return taskPriorities;
	} catch (error) {
		console.error("Error fetching priorities", error);
	} finally {
		client.release();
	}
}

export async function getTasksByProjectId(projectId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getTasksQuery, [projectId]);
		const todoTasks = result.rows;
		return todoTasks;
	} catch (error) {
		console.error("Error fetching tasks", error);
	} finally {
		client.release();
	}
}

export async function getTasksByProjectIdAndAssigneeId(
	projectId: number,
	assigneeId: number
) {
	const client = await pool.connect();
	try {
		const result = await client.query(getTasksByProjectIdAndAssigneeIdQuery, [
			projectId,
			assigneeId,
		]);
		const todoTasks = result.rows;
		return todoTasks;
	} catch (error) {
		console.error("Error fetching tasks", error);
	} finally {
		client.release();
	}
}

export async function getTaskDetails(taskId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getTaskDetailsQuery, [taskId]);
		const task = result.rows[0];
		return task;
	} catch (error) {
		console.error("Error fetching task", error);
	} finally {
		client.release();
	}
}

export async function getSubTasks(taskId: number) {
	const client = await pool.connect();
	try {
		const result = await client.query(getSubTasksQuery, [taskId]);
		const subTasks = result.rows;
		return subTasks;
	} catch (error) {
		console.error("Error fetching sub tasks", error);
	} finally {
		client.release();
	}
}
