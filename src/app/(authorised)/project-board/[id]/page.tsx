"use client";
import {
	getProjectDetails,
	getProjectStages,
	getTeamMembersFromProjectId,
} from "@/app/actions/project-management/getData";
import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import getTaskPriorities, {
	getTasksByProjectId,
	getTasksByProjectIdAndAssigneeId,
} from "@/app/actions/task-management/getData";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import defaultAvatar from "../../../../../public/images/profilepictures/avatar.png";
import createTask, {
	changeTaskStatus,
} from "@/app/actions/task-management/addTaskAction";
import Link from "next/link";
import getRoleNameByRoleId from "@/app/actions/role-management/getRoleNameByRoleId";

interface Params {
	id: number;
}

interface ViewProjectPageProps {
	params: Params;
}

interface ProjectDetailsTypes {
	id: number | null;
	project_name: string;
}

interface ProjectStagesTypes {
	id: number | null;
	stage_name: string;
}

interface TaskPriority {
	id: number;
	priority_name: string;
}

interface TeamMembers {
	id: number;
	first_name: string;
	last_name: string;
	profile_picture: string;
}

interface TaskTypes {
	id: number | null;
	task_name: string;
	stage_name: string;
	priority_name: string;
	stage_id: number | null;
}

interface ErrorMsg {
	field: string;
	message: string;
}
export default function ViewProjectPage({ params }: ViewProjectPageProps) {
	const { data: session } = useSession();
	const firstName = session?.user.first_name ?? "";
	const loggedInUser = `${session?.user.first_name} ${session?.user.last_name}`;
	const id = params.id;
	const [projectDetails, setProjectDetails] = useState<ProjectDetailsTypes>({
		id: null,
		project_name: "",
	});
	const [projectStages, setProjectStages] = useState<ProjectStagesTypes[]>([]);
	let [isOpen, setIsOpen] = useState(false);
	const [taskPriorities, setTaskPriorities] = useState<TaskPriority[]>([]);
	const [taskName, setTaskName] = useState<string>("");
	const [selectedTaskPriority, setSelectedTaskPriority] = useState<string>("");
	const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
	const [selectedAssignee, setSelectedAssignee] = useState<string>("");
	const defaultDate = new Date("2024-12-31");
	defaultDate.setHours(0, 0, 0, 0);
	const [dueDate, setDueDate] = useState<Date>(defaultDate);
	const [errors, setErrors] = useState<ErrorMsg[]>([]);
	const [taskDescription, setTaskDescription] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [tasks, setTasks] = useState<TaskTypes[]>([
		{
			id: null,
			task_name: "",
			stage_name: "",
			priority_name: "",
			stage_id: null,
		},
	]);

	const [taskStages, setTaskStages] = useState(() =>
		tasks.reduce((acc, task) => {
			if (task.id !== null) {
				acc[task.id] = {
					taskId: task.id,
					stage_name: task.stage_name,
				};
			}
			return acc;
		}, {})
	);

	const userProfilePicture = session?.user.profile_picture || defaultAvatar;

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const fetchProjectDetails = async () => {
		const projectDetailsResponse = await getProjectDetails(id);
		setProjectDetails(projectDetailsResponse);
	};

	const fetchProjectStages = async () => {
		const projectStagesResponse = await getProjectStages();
		setProjectStages(projectStagesResponse || []);
	};

	const fetchTaskPriorities = async () => {
		const taskPrioritiesResponse = await getTaskPriorities();
		setTaskPriorities(taskPrioritiesResponse || []);
	};

	const fetchTeamMembers = async () => {
		if (id) {
			const result = await getTeamMembersFromProjectId(id);
			setTeamMembers(result || []);
		}
	};

	const fetchLoggedInUserRole = async () => {
		const session = await getSession();
		const loggedInRoleId = session?.user?.role_id as number;
		const user_id = session?.user.id ?? 1;
		setAssigneeId(user_id);
		if (loggedInRoleId) {
			const response = await getRoleNameByRoleId(loggedInRoleId);
			setRole(response);
		}
	};

	const fetchTasks = async () => {
		const response = await getTasksByProjectId(id);
		setTasks(response || []);
	};

	const fetchTasksByProjectIdAndAssigneeId = async () => {
		if (assigneeId) {
			const response = await getTasksByProjectIdAndAssigneeId(id, assigneeId); // get the taks for the logged in developer
			setTasks(response || []);
		}
	};

	useEffect(() => {
		// fetch all data
		fetchProjectDetails();
		fetchProjectStages();
		fetchTaskPriorities();
		fetchTeamMembers();
		fetchLoggedInUserRole();
	}, [id]);

	useEffect(() => {
		// if logged in user is of developer role, show only his tasks otherwise show all
		if (role !== "" && assigneeId !== null) {
			role === "Developer"
				? fetchTasksByProjectIdAndAssigneeId()
				: fetchTasks();
		}
	}, [role, assigneeId, isOpen]);

	useEffect(() => {
		const updateTaskStatus = async () => {
			// update status only if user changed value of stage name
			if (Object.keys(taskStages).length > 0) {
				for (const [taskId, task] of Object.entries(taskStages)) {
					await changeTaskStatus(taskId, task.stage_name);
				}

				// re-render the task data on task status change
				const updatedTasks = await getTasksByProjectId(id);
				setTasks(updatedTasks || []);
			}
		};

		updateTaskStatus();
	}, [taskStages, id]);

	const handleCreateTaskBox = () => {
		setIsOpen(true);
	};

	const handleTaskPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTaskPriority(e.target.value);
	};

	const handleTaskAssignee = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedAssignee(e.target.value);
	};

	const handleStageNameChange = (taskId: any, newStage: any) => {
		setMessage("");
		const updateTaskStage = (taskId: number, newStage: string) => {
			setTaskStages((prevStages) => ({
				...prevStages,
				[taskId]: {
					taskId: taskId,
					stage_name: newStage,
				},
			}));
		};
		updateTaskStage(taskId, newStage);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		// function to handle create new task
		e.preventDefault();
		const formattedDate = formatDate(dueDate);
		const taskDetails = {
			id: id,
			taskName: taskName,
			taskPriority: selectedTaskPriority,
			assignee: selectedAssignee,
			dueDate: formattedDate,
			createdBy: firstName,
			taskDescription: taskDescription,
		};
		const response = await createTask(taskDetails);
		if (response?.success) {
			setIsOpen(false);
			setMessage("Task Created successfully");
		} else {
			setIsOpen(true);
			setErrors(response?.errors || []);
		}
	};

	// Show error depending on field
	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
	};
	return (
		<>
			<div className="w-full px-5 py-6">
				<p className="text-center text-green-500">{message}</p>
				<div className="flex gap-2 justify-between items-center">
					<div className="flex gap-2">
						<input
							type="text"
							name="project_name"
							id="project_name"
							className="rounded-md border border-primaryBorder p-2 w-60"
							value={projectDetails.project_name}
						/>
					</div>
					<div className="flex gap-4">
						<button
							onClick={handleCreateTaskBox}
							className="px-4 py-2 text-white bg-primary rounded-lg text-center flex gap-2 justify-center items-center"
						>
							Create Task
							<svg
								width="18"
								height="17"
								viewBox="0 0 18 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M5.10768 0.166748H12.8827C15.716 0.166748 17.3327 1.76675 17.3327 4.60841V12.3917C17.3327 15.2167 15.7243 16.8334 12.891 16.8334H5.10768C2.26602 16.8334 0.666016 15.2167 0.666016 12.3917V4.60841C0.666016 1.76675 2.26602 0.166748 5.10768 0.166748ZM9.68268 9.19175H12.0493C12.4327 9.18342 12.741 8.87508 12.741 8.49175C12.741 8.10842 12.4327 7.80008 12.0493 7.80008H9.68268V5.45008C9.68268 5.06675 9.37435 4.75841 8.99102 4.75841C8.60768 4.75841 8.29935 5.06675 8.29935 5.45008V7.80008H5.94102C5.75768 7.80008 5.58268 7.87508 5.44935 8.00008C5.32435 8.13342 5.24935 8.30758 5.24935 8.49175C5.24935 8.87508 5.55768 9.18342 5.94102 9.19175H8.29935V11.5501C8.29935 11.9334 8.60768 12.2417 8.99102 12.2417C9.37435 12.2417 9.68268 11.9334 9.68268 11.5501V9.19175Z"
									fill="white"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="w-full py-6">
					<div className="flex gap-5">
						{projectStages.map((stage) => {
							let borderColorClass = "border-black";
							if (stage.stage_name === "In Progress") {
								borderColorClass = "border-primary";
							} else if (stage.stage_name === "Completed") {
								borderColorClass = "border-green-600";
							}
							return (
								<div className="w-1/3 h-auto bg-white p-2" key={stage.id}>
									<div className="flex flex-col gap-2 justify-start items-start py-4">
										<h3 className="text-lg">{stage.stage_name}</h3>
										<hr className={`w-full border ${borderColorClass}`} />
										<div className="flex flex-col gap-4 items-center justify-center p-4">
											{tasks
												.filter((task) => task.stage_id === stage.id)
												.map((task, index) => {
													let priorityColor = "primary";
													let svgColor = "bg-primary";
													if (task.priority_name === "medium") {
														priorityColor = "yellow-500";
														svgColor = "bg-yellow-300";
													} else if (task.priority_name === "high") {
														priorityColor = "errorColor";
														svgColor = "bg-errorColor";
													}
													return (
														<div
															className="border border-primaryBorder rounded-md shadow-md p-4"
															key={index}
														>
															<div className="w-full flex gap-3 justify-start items-center">
																<div className="flex flex-col gap-4">
																	<div className="w-20 h-10 bg-primary flex justify-center items-center rounded-md">
																		<svg
																			width="28"
																			height="28"
																			viewBox="0 0 28 28"
																			fill="none"
																			xmlns="http://www.w3.org/2000/svg"
																		>
																			<path
																				fill-rule="evenodd"
																				clip-rule="evenodd"
																				d="M9.11167 2.33331H18.8895C22.4933 2.33331 24.5 4.40998 24.5 7.96831V20.02C24.5 23.6366 22.4933 25.6666 18.8895 25.6666H9.11167C5.565 25.6666 3.5 23.6366 3.5 20.02V7.96831C3.5 4.40998 5.565 2.33331 9.11167 2.33331ZM9.42667 7.76998V7.75831H12.9138C13.4167 7.75831 13.825 8.16665 13.825 8.66715C13.825 9.18165 13.4167 9.58998 12.9138 9.58998H9.42667C8.92383 9.58998 8.51667 9.18165 8.51667 8.67998C8.51667 8.17831 8.92383 7.76998 9.42667 7.76998ZM9.42667 14.8633H18.5733C19.075 14.8633 19.4833 14.455 19.4833 13.9533C19.4833 13.4516 19.075 13.0421 18.5733 13.0421H9.42667C8.92383 13.0421 8.51667 13.4516 8.51667 13.9533C8.51667 14.455 8.92383 14.8633 9.42667 14.8633ZM9.42667 20.195H18.5733C19.0388 20.1483 19.39 19.7505 19.39 19.285C19.39 18.8066 19.0388 18.41 18.5733 18.3633H9.42667C9.07667 18.3283 8.73833 18.4916 8.55167 18.795C8.365 19.0866 8.365 19.4716 8.55167 19.775C8.73833 20.0666 9.07667 20.2416 9.42667 20.195Z"
																				fill="white"
																			/>
																		</svg>
																	</div>
																	<div className="flex flex-col gap-2 justify-start">
																		<Link
																			href={`/task/${task.id}`}
																			className="font-semibold text-infoDark"
																		>
																			{task.task_name}
																		</Link>

																		<select
																			id="taskPriority"
																			name="taskPriority"
																			className="border border-primaryBorder rounded-lg capitalize w-1/2"
																			value={taskStages[task.id]?.stage_name}
																			onChange={(e) =>
																				handleStageNameChange(
																					task.id,
																					e.target.value
																				)
																			}
																		>
																			<option
																				value={taskStages[task.id]?.stage_name}
																				selected
																			>
																				{stage.stage_name}
																			</option>
																			{projectStages.map((stage, index) => (
																				<option
																					key={index}
																					value={stage.stage_name}
																				>
																					{stage.stage_name}
																				</option>
																			))}
																		</select>
																	</div>
																	<div className="flex gap-2 items-center justify-end py-2">
																		<div
																			className={`w-5 h-5 ${svgColor} flex justify-center items-center text-white rounded-full`}
																		>
																			<svg
																				width="10"
																				height="10"
																				viewBox="0 0 18 96"
																				fill="none"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<rect
																					width="18"
																					height="69"
																					rx="9"
																					fill="#fff"
																				/>
																				<rect
																					y="77"
																					width="18"
																					height="19"
																					rx="9"
																					fill="#fff"
																				/>
																			</svg>
																		</div>
																		<p
																			className={`text-sm text-${priorityColor}`}
																		>
																			{task.priority_name}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<Dialog
					open={isOpen}
					onClose={() => setIsOpen(false)}
					className="relative z-50"
				>
					<div className="fixed inset-0 flex w-screen items-center justify-end p-2">
						<DialogPanel className="w-1/2 space-y-4 border bg-white p-4">
							<form
								onSubmit={handleSubmit}
								className="flex flex-col gap-3 w-full justify-start items-center py-2"
							>
								<div className="flex flex-col gap-2 w-full">
									<div className="flex gap-2">
										<label htmlFor="taskName">Task Name:</label>
										<span className="text-red-500">*</span>
										{getErrorMessage("taskName") && (
											<p className="text-sm text-red-500">
												{getErrorMessage("taskName")}
											</p>
										)}
									</div>
									<input
										type="text"
										name="taskName"
										id="taskName"
										className="formInputStyle pl-4 w-1/2"
										onChange={(e) => setTaskName(e.target.value)}
										value={taskName}
									/>
								</div>
								<div className="flex gap-4 w-full">
									<div className="flex gap-2">
										<label htmlFor="projectPriority">Priority:</label>
										<span className="text-red-500">*</span>
									</div>

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
								<hr className="w-full bg-black border" />

								<div className="flex gap-4 w-full">
									<div className="flex gap-2">
										<label htmlFor="assignee">Assignee:</label>
										<span className="text-red-500">*</span>
									</div>

									<select
										id="assignee"
										name="assignee"
										className="border border-primaryBorder rounded-lg capitalize"
										value={selectedAssignee}
										onChange={handleTaskAssignee}
									>
										<option value={selectedAssignee} selected>
											{selectedAssignee !== "" ? selectedAssignee : "Select..."}
										</option>
										{teamMembers.map((assignee, index) => (
											<option
												key={index}
												value={`${assignee.first_name} ${assignee.last_name}`}
											>
												{`${assignee.first_name} ${assignee.last_name}`}
											</option>
										))}
									</select>
									{getErrorMessage("assignee") && (
										<p className="text-sm text-red-500">
											{getErrorMessage("assignee")}
										</p>
									)}
								</div>
								<div className="flex flex-col gap-2 w-full">
									<div className="flex gap-2">
										<label htmlFor="dueDate">Due Date:</label>
										<span className="text-red-500">*</span>
										{getErrorMessage("dueDate") && (
											<p className="text-sm text-red-500">
												{getErrorMessage("dueDate")}
											</p>
										)}
									</div>
									<input
										type="date"
										name="dueDate"
										id="dueDate"
										className="formInputStyle pl-4 w-1/3"
										onChange={(e) => setDueDate(new Date(e.target.value))}
										value={formatDate(dueDate)}
									/>
								</div>
								<div className="flex gap-3 w-full items-center">
									<div className="flex gap-2">
										<label htmlFor="status">Status: </label>
									</div>
									<div className="w-20 py-1 bg-primaryBorder text-black flex justify-center items-center">
										<p className="font-semibold text-sm">To Do</p>
									</div>
								</div>
								<div className="flex gap-3 w-full items-center py-1">
									<div className="flex gap-2">
										<label htmlFor="status">Created By: </label>
									</div>
									{loggedInUser && (
										<div className="flex items-center gap-2">
											<Image
												src={userProfilePicture}
												alt="profilePicture"
												width={20}
												height={20}
												className="object-cover rounded-full"
											/>

											<p className="font-semibold text-sm">{loggedInUser}</p>
										</div>
									)}
								</div>
								<div className="flex flex-col gap-4 w-full">
									<label htmlFor="projectDescription">Description:</label>
									<textarea
										name="taskDescription"
										id="taskDescription"
										className="formInputStyle w-4/5 h-24 pl-4 bg-primaryBorder"
										placeholder="Type task description"
										onChange={(e) => setTaskDescription(e.target.value)}
										value={taskDescription}
									></textarea>
								</div>
								<div className="flex gap-4">
									<button
										type="submit"
										className="bg-primary px-4 py-2 text-white rounded-md"
									>
										Create
									</button>
									<button
										className="bg-iconColor px-4 py-2 text-white rounded-md"
										onClick={() => setIsOpen(false)}
									>
										Cancel
									</button>
								</div>
							</form>
						</DialogPanel>
					</div>
				</Dialog>
			</div>
		</>
	);
}
