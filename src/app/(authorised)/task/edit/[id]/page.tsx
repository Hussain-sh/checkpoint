"use client";

import getTaskPriorities, {
	getTaskDetails,
} from "@/app/actions/task-management/getData";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultAvatar from "../../../../../../public/images/profilepictures/avatar.png";
import {
	getProjectStages,
	getTeamMembersFromProjectId,
} from "@/app/actions/project-management/getData";
import { useFormState } from "react-dom";
import editTaskDetails from "@/app/actions/task-management/editTaskAction";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface Params {
	id: number;
}

interface EditTaskPageProps {
	params: Params;
}

interface TaskDetailsTypes {
	id: number | null;
	task_name: string;
	task_description: string;
	stage_name: string;
	priority_name: string;
	creator_first_name: string;
	creator_last_name: string;
	creator_profile_picture: string;
	assignee_first_name: string;
	assignee_last_name: string;
	assignee_profile_picture: string;
}

interface TaskPriority {
	id: number;
	priority_name: string;
}

interface ErrorMsg {
	field: string;
	message: string;
}

interface TeamMembers {
	id: number;
	first_name: string;
	last_name: string;
	profile_picture: string;
}

export default function ViewTaskPage({ params }: EditTaskPageProps) {
	const id = params.id;
	const { data: session } = useSession();
	const user_id = session?.user.id;
	const loggedInUserEmail = session?.user.email ?? "";
	const [taskDetails, setTaskDetails] = useState<TaskDetailsTypes>({
		id: null,
		task_name: "",
		task_description: "",
		stage_name: "",
		priority_name: "",
		creator_first_name: "",
		creator_last_name: "",
		creator_profile_picture: "",
		assignee_first_name: "",
		assignee_last_name: "",
		assignee_profile_picture: "",
	});

	const [projectId, setProjectId] = useState<number | null>(null);
	const [taskName, setTaskName] = useState<string>("");
	const [taskDescription, setTaskDescription] = useState<string>("");
	const [taskPriorities, setTaskPriorities] = useState<TaskPriority[]>([]);
	const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
	const [selectedAssignee, setSelectedAssignee] = useState<string>("");
	const [selectedTaskPriority, setSelectedTaskPriority] = useState<string>("");
	const [selectedStageName, setSelectedStageName] = useState<string>("");
	const [errors, setErrors] = useState<ErrorMsg[]>([]);

	const [state, formAction] = useFormState(editTaskDetails, {
		errors: [],
		success: false,
	});

	useEffect(() => {
		const fetchTaskDetails = async () => {
			const response = await getTaskDetails(id);
			setProjectId(response.project_id);
			setTaskDetails(response);
			setTaskName(response.task_name);
			setTaskDescription(response.task_description);
			setSelectedStageName(response.stage_name);
			setSelectedTaskPriority(response.priority_name);
			setSelectedAssignee(
				`${response.assignee_first_name} ${response.assignee_last_name}`
			);
		};

		const fetchTaskPriorities = async () => {
			const taskPrioritiesResponse = await getTaskPriorities();
			setTaskPriorities(taskPrioritiesResponse || []);
		};

		fetchTaskPriorities();
		fetchTaskDetails();

		if (state?.success) {
			redirect(`/task/${id}`);
		} else {
			setErrors(state?.errors || []);
		}
	}, [id, state]);

	useEffect(() => {
		const fetchTeamMembers = async () => {
			if (projectId) {
				const response = await getTeamMembersFromProjectId(projectId);
				setTeamMembers(response || []);
			}
		};

		fetchTeamMembers();
	}, [projectId]);

	let creatorName = `${taskDetails.creator_first_name} ${taskDetails.creator_last_name}`;

	const handleTaskPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTaskPriority(e.target.value);
	};

	const handleAssignee = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedAssignee(e.target.value);
	};

	// Show error depending on field
	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
	};
	return (
		<div className="w-full p-5 flex gap-5">
			<div className="w-3/4 bg-white p-5 flex flex-col gap-4 justify-start items-start rounded-lg">
				<form action={formAction} className="w-full">
					<div className="w-full flex justify-between items-center">
						<div className="flex flex-col gap-2 w-full">
							<input
								type="text"
								name="taskName"
								id="taskName"
								className="formInputStyle pl-4 py-2 w-3/4"
								onChange={(e) => setTaskName(e.target.value)}
								value={taskName}
							/>
							{getErrorMessage("taskName") && (
								<p className="text-sm text-red-500">
									{getErrorMessage("taskName")}
								</p>
							)}
						</div>
						<div className="flex gap-2 items-center justify-start">
							<button
								type="submit"
								className="w-40 px-4 py-2 text-white text-sm bg-primary rounded-lg text-center"
							>
								Save Changes
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-4 w-full">
						<label htmlFor="taskDescription">Description:</label>
						<textarea
							name="taskDescription"
							id="taskDescription"
							className="formInputStyle w-4/5 h-24 pl-4 bg-primaryBorder"
							placeholder="Type task description"
							onChange={(e) => setTaskDescription(e.target.value)}
							value={taskDescription}
						></textarea>
					</div>
					<input
						type="hidden"
						value={selectedTaskPriority}
						name="taskPriority"
					/>
					<input type="hidden" value={selectedAssignee} name="assignee" />
					<input type="hidden" value={id} name="id" />
					<input type="hidden" value={user_id} name="user_id" />
					<input type="hidden" value={loggedInUserEmail} name="email" />
				</form>
			</div>
			<div className="w-1/4 flex flex-col gap-4">
				<div className="w-full bg-white py-4 rounded-lg">
					<p className="px-4 font-bold text-lg py-2">Details</p>
					<hr className="w-full border" />
					<div className="flex flex-col gap-4">
						<div className=" w-full pt-2 flex justify-between items-stretch px-4">
							<p className="capitalise">Status</p>
							<div className="w-16 py-1 bg-primaryBorder text-black rounded-md flex justify-center items-center">
								<p className="font-semibold text-sm">
									{taskDetails.stage_name}
								</p>
							</div>
						</div>
						<div className=" w-full pt-2 flex justify-between items-center px-4">
							<p className="capitalise">Priority</p>
							<div className="flex gap-4">
								<select
									id="taskPriority"
									name="taskPriority"
									className="border border-primaryBorder rounded-lg capitalize"
									value={selectedTaskPriority}
									onChange={handleTaskPriority}
								>
									<option value={selectedTaskPriority} selected>
										{selectedTaskPriority !== ""
											? selectedTaskPriority
											: "Select..."}
									</option>
									{taskPriorities.map((priority, index) => (
										<option key={index} value={priority.priority_name}>
											{priority.priority_name}
										</option>
									))}
								</select>
								{getErrorMessage("taskPriority") && (
									<p className="text-sm text-red-500">
										{getErrorMessage("taskPriority")}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full bg-white py-4 rounded-lg">
					<div className="py-2 flex flex-col gap-2">
						<p className="px-4 font-bold text-lg">Assignee</p>
						<hr className="w-full border" />
						<div className="flex gap-4 px-4">
							<select
								id="assignee"
								name="assignee"
								className="border border-primaryBorder rounded-lg capitalize"
								value={selectedAssignee}
								onChange={handleAssignee}
							>
								<option value={selectedAssignee} selected>
									{selectedAssignee !== "" ? selectedAssignee : "Select..."}
								</option>
								{teamMembers.map((team, index) => (
									<option
										key={index}
										value={`${team.first_name} ${team.last_name}`}
									>
										{`${team.first_name} ${team.last_name}`}
									</option>
								))}
							</select>
							{getErrorMessage("assignee") && (
								<p className="text-sm text-red-500">
									{getErrorMessage("assignee")}
								</p>
							)}
						</div>
					</div>
					<div className="py-2 flex flex-col gap-2">
						<p className="px-4 font-bold text-lg">Created By</p>
						<hr className="w-full border" />
						{taskDetails.creator_profile_picture && (
							<div className="flex gap-2 justify-start items-center px-4">
								{taskDetails.creator_profile_picture !== null ? (
									<Image
										src={taskDetails.creator_profile_picture}
										alt="profilePicture"
										width={20}
										height={20}
										className="object-cover rounded-full"
									/>
								) : (
									<Image
										src={defaultAvatar}
										alt="profilePicture"
										width={20}
										height={20}
										className="object-cover rounded-full"
									/>
								)}

								<p className="text-sm py-2">{creatorName}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
