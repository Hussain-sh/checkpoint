"use server";
import {
	addProjectQuery,
	addProjectTeamQuery,
	editProjectQuery,
} from "@/app/dbQueries/project-management";
import pool from "@/utils/postgres";
import base64ToFile from "@/utils/services/convertBase64toFile";
import fs from "node:fs";
import auditLogAction from "../auditLogAction";

interface SelectedTeamMembers {
	value: string | null;
	label: string | null;
}

interface FormData {
	id: number | null;
	projectName: string;
	projectPriority: string;
	team: SelectedTeamMembers[];
	lead: string;
	projectDescription: string;
	image: File | string;
	projectCreator: string;
	loggedInUserEmail: string;
	userId: number | undefined;
}

interface ErrorMsg {
	field: string;
	message: string;
}

function isTextEmpty(text: string) {
	return !text || text.trim() === "";
}

export default async function createProject(formData: FormData) {
	const {
		id,
		projectName,
		projectPriority,
		lead,
		team,
		projectDescription,
		image,
		loggedInUserEmail,
		userId,
	} = formData;

	const [first_name] = lead.split(" ");

	let imageFile = null;
	let imagePath = null;
	if (image) {
		imageFile = base64ToFile(image, "uploaded_image.png");
		if (!imageFile) {
			console.error("Failed to convert image to File object!");
			return;
		}
	}

	if (imageFile !== null) {
		const extension = imageFile.name.split(".").pop();
		const fileName = `${projectName}-${Date.now()}.${extension}`;
		const stream = fs.createWriteStream(
			`public/images/projecticons/${fileName}`
		);

		const bufferedImage = await imageFile.arrayBuffer();

		stream.write(Buffer.from(bufferedImage), (error) => {
			if (error) {
				throw new Error("Saving Image failed!");
			}
		});

		imagePath = `/images/projecticons/${fileName}`;
	}

	const errors: ErrorMsg[] = [];
	if (isTextEmpty(projectName))
		errors.push({ field: "projectName", message: "Project name is required." });
	if (isTextEmpty(projectPriority))
		errors.push({
			field: "projectPriority",
			message: "Please give priority to the project",
		});
	if (isTextEmpty(lead))
		errors.push({ field: "lead", message: "Please assign a team lead" });

	// check for teammembers only when creating new project
	if (!id) {
		if (team.length === 0) {
			errors.push({ field: "team", message: "Please assign  team members" });
		}
	}

	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	const client = await pool.connect();
	try {
		if (id) {
			const result = await client.query(editProjectQuery, [
				id,
				projectName,
				projectPriority,
				first_name,
				projectDescription,
				imagePath,
			]);
			const projectId = result.rows[0];
			// update project audit logs
			const projectDetailsForAuditLogs = {
				projectName: projectName,
				projectPriority: projectPriority,
				lead: lead,
				projectDescription: projectDescription,
				image: imagePath,
			};
			const projectDetailsValues = Object.entries(projectDetailsForAuditLogs)
				.map(([key, value]) => `${key}: ${value}`)
				.join(", ");
			if (userId) {
				const auditLogData = {
					logType: "info",
					feature: "Project management",
					action: `User with email ${loggedInUserEmail} updated project ${projectName}. Project details : ${projectDetailsValues}`,
					userId: userId,
				};
				await auditLogAction(auditLogData);
			}
			return {
				success: true,
				projectId,
				editTeams: true,
			};
		} else {
			const result = await client.query(addProjectQuery, [
				projectName,
				projectPriority,
				first_name,
				projectDescription,
				imagePath,
			]);
			const projectId = result.rows[0];

			// audit logs for create projects
			const projectDetailsForAuditLogs = {
				projectName: projectName,
				projectPriority: projectPriority,
				lead: lead,
				projectDescription: projectDescription,
				image: imagePath,
			};
			const projectDetailsValues = Object.entries(projectDetailsForAuditLogs)
				.map(([key, value]) => `${key}: ${value}`)
				.join(", ");
			if (userId) {
				const auditLogData = {
					logType: "info",
					feature: "Project management",
					action: `User with email ${loggedInUserEmail} created a new project. Project details : ${projectDetailsValues}`,
					userId: userId,
				};
				await auditLogAction(auditLogData);
			}
			return {
				success: true,
				projectId,
				editTeams: false,
			};
		}
	} catch (error) {
		console.error("Error adding project", error);
	} finally {
		client.release();
	}
}

export async function addProjectTeam(
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
