"use server";
import {
	addProjectQuery,
	addProjectTeamQuery,
	editProjectQuery,
} from "@/app/dbQueries/project-management";
import {
	addSubTaskQuery,
	addTaskQuery,
	changeTaskStatusQuery,
	moveTaskToArchiveQuery,
} from "@/app/dbQueries/task-management";
import pool from "@/utils/postgres";
import auditLogAction from "../auditLogAction";

interface FormData {
	id: number | null;
	taskName: string;
	taskPriority: string;
	assignee: string;
	dueDate: string;
	createdBy: string;
	taskDescription: string;
	projectName: string;
	user_id: number | undefined;
	loggedInUserEmail: string | undefined | null;
}

interface SubTaskDetails {
	subTaskName: string;
	subTaskDescription: string;
	taskId: number | null;
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
		projectName,
		user_id,
		loggedInUserEmail,
	} = formData;

	const [creator_first_name] = createdBy.split(" ");
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
			creator_first_name,
			taskPriority,
			assignee,
			id,
		]);

		// audit logs for create projects
		const taskDetailsForAuditLogs = {
			taskName: taskName,
			taskPriority: taskPriority,
			taskDescription: taskDescription,
			dueDate: dueDate,
		};
		const taskDetailsValues = Object.entries(taskDetailsForAuditLogs)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ");
		if (user_id) {
			const auditLogData = {
				logType: "info",
				feature: "Task management",
				action: `User with email ${loggedInUserEmail} created a new task under project ${projectName} . Task details : ${taskDetailsValues}`,
				userId: user_id,
			};
			await auditLogAction(auditLogData);
		}
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

export async function moveTaskToArchive(taskId: number | null) {
	const client = await pool.connect();
	try {
		await client.query(moveTaskToArchiveQuery, [taskId]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating task", error);
	} finally {
		client.release();
	}
}

export async function createSubTask(subTaskDetails: SubTaskDetails) {
	const { subTaskName, subTaskDescription, taskId } = subTaskDetails;

	const errors: ErrorMsg[] = [];
	if (isTextEmpty(subTaskName))
		errors.push({
			field: "subTaskName",
			message: "sub-task name is required.",
		});

	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}
	const client = await pool.connect();

	try {
		await client.query(addSubTaskQuery, [
			subTaskName,
			subTaskDescription,
			taskId,
		]);

		return {
			success: true,
			errors: [],
		};
	} catch (error) {
		console.error("Error adding sub-task", error);
	} finally {
		client.release();
	}
}
