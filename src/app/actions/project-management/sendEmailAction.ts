"use server";

import {
	sendAssignTaskEmail,
	sendProjectCreatedEmail,
	sendStatusChangeEmail,
} from "@/utils/services/sendEmail";
import getUserDetails from "../user-management/getUserDetailsByIdAction";
import { getTaskDetails } from "../task-management/getData";
import getProfileDetails from "../profile-management/getProfileDetailsAction";
import { getProjectDetails } from "./getData";

interface SelectedTeamMembers {
	value: string | null;
	label: string | null;
}

interface ProjectDetails {
	id: number | null;
	projectName: string;
	projectPriority: string;
	team: SelectedTeamMembers[];
	lead: string;
	projectDescription: string;
	image: File | string;
	projectCreator: string;
}

interface TaskDetails {
	id: number | null;
	taskName: string;
	taskPriority: string;
	assignee: string;
	dueDate: string;
	createdBy: string;
	taskDescription: string;
	projectName: string;
}

export default async function sendEmailOnProjectCreation(
	projectDetails: ProjectDetails
) {
	const { projectName, lead, team, projectCreator } = projectDetails;

	for (let user of team) {
		if (user.value) {
			const response = await getUserDetails(user.value);
			await sendProjectCreatedEmail(
				response.first_name,
				projectName,
				projectCreator,
				response.email
			);
		}
	}
}

export async function sendEmailOnTaskCreation(taskDetails: TaskDetails) {
	const { taskName, assignee, createdBy, projectName, dueDate } = taskDetails;
	const response = await getUserDetails(assignee);
	await sendAssignTaskEmail(
		taskName,
		response.first_name,
		createdBy,
		projectName,
		dueDate,
		response.email
	);
}

export async function sendTaskStatusChangeEmail(
	project_id: number,
	task_id: string,
	updated_by: string,
	status: string
) {
	const taskDetailResponse = await getTaskDetails(task_id);
	const projectDetailsResponse = await getProjectDetails(project_id);
	const userDetailsResponse = await getUserDetails(
		projectDetailsResponse.user_id
	);
	const first_name = userDetailsResponse.first_name;
	await sendStatusChangeEmail(
		taskDetailResponse.task_name,
		projectDetailsResponse.project_name,
		updated_by,
		status,
		first_name,
		userDetailsResponse.email
	);
}
