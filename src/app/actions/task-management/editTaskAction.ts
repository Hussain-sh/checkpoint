"use server";
import { editTaskQuery } from "@/app/dbQueries/task-management";
import pool from "@/utils/postgres";

interface ErrorMsg {
	field: string;
	message: string;
}

interface FormState {
	success: boolean;
	errors: ErrorMsg[];
}

function isTextEmpty(text: string) {
	return !text || text.trim() === "";
}

export default async function editTaskDetails(
	prevState: FormState,
	formData: FormData
) {
	const task = {
		id: formData.get("id") as number | null,
		task_name: formData.get("taskName") as string,
		task_description: formData.get("taskDescription") as string,
		task_priority: formData.get("taskPriority") as string,
		assignee: formData.get("assignee") as string,
	};

	const { id, task_name, task_description, task_priority, assignee } = task;

	const [first_name] = assignee.split(" ");

	const errors: ErrorMsg[] = [];

	if (isTextEmpty(task_name))
		errors.push({ field: "taskName", message: "Task name is required." });
	if (isTextEmpty(task_priority))
		errors.push({
			field: "taskPriority",
			message: "Please give priority to the task",
		});
	if (isTextEmpty(assignee))
		errors.push({ field: "assignee", message: "Please give an assignee" });

	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	const client = await pool.connect();
	try {
		await client.query(editTaskQuery, [
			id,
			task_name,
			task_description,
			task_priority,
			first_name,
		]);
		return {
			success: true,
		};
	} catch (error) {
		console.error("Error updating task", error);
	} finally {
		client.release();
	}
}
