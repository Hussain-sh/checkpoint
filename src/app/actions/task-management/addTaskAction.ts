"use server";
import {
	addProjectQuery,
	addProjectTeamQuery,
	editProjectQuery,
} from "@/app/dbQueries/project-management";
import {
	addTaskQuery,
	changeTaskStatusQuery,
} from "@/app/dbQueries/task-management";
import pool from "@/utils/postgres";

interface FormData {
	id: number | null;
	taskName: string;
	taskPriority: string;
	assignee: string;
	dueDate: string;
	createdBy: string;
	taskDescription: string;
}

interface ErrorMsg {
	field: string;
	message: string;
}

function isTextEmpty(text: string) {
	return !text || text.trim() === "";
}

export default async function createTask(formData: FormData) {
	const {
		id,
		taskName,
		taskPriority,
		assignee,
		dueDate,
		createdBy,
		taskDescription,
	} = formData;

	const [first_name] = assignee.split(" ");
	const errors: ErrorMsg[] = [];

	if (isTextEmpty(taskName))
		errors.push({ field: "taskName", message: "Task name is required." });
	if (isTextEmpty(taskPriority))
		errors.push({
			field: "taskPriority",
			message: "Please give priority to the task",
		});
	if (isTextEmpty(assignee))
		errors.push({ field: "assignee", message: "Please give an assignee" });
	if (isTextEmpty(dueDate))
		errors.push({
			field: "dueDate",
			message: "Please gie a due date for the task",
		});

	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	const client = await pool.connect();
	try {
		await client.query(addTaskQuery, [
			taskName,
			taskDescription,
			dueDate,
			createdBy,
			taskPriority,
			first_name,
			id,
		]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error adding task", error);
	} finally {
		client.release();
	}
}

export async function changeTaskStatus(taskId: string, stageName: string) {
	const client = await pool.connect();
	try {
		await client.query(changeTaskStatusQuery, [taskId, stageName]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating task", error);
	} finally {
		client.release();
	}
}
