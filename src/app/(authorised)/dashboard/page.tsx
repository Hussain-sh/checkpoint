"use client";
import {
	getRecentProjects,
	getRecentTasks,
	getTasksByProjectId,
} from "@/app/actions/project-management/getData";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
interface RecentProjectsTypes {
	id: number | null;
	project_name: string;
	project_icon: string;
	priority_name: string;
}

interface RecentTaskTypes {
	id: number | null;
	task_name: string;
	stage_name: string;
	priority_name: string;
}

export default function DashBoard() {
	const [recentProjects, setRecentProjects] = useState<RecentProjectsTypes[]>(
		[]
	);

	const [recentTasks, setRecentTasks] = useState<RecentTaskTypes[]>([]);

	const [projectTasks, setProjectTasks] = useState({});
	const [roleId, setRoleId] = useState(null);

	useEffect(() => {
		const fetchDataForDashboard = async () => {
			const session = await getSession();
			const user_id = session?.user.id as number;
			const role_id = session?.user.role_id as number;
			setRoleId(role_id);
			if (role_id === 2) {
				const response = await getRecentProjects(user_id, role_id);
				setRecentProjects(response || []);
			}

			if (role_id === 3) {
				const response = await getRecentTasks(user_id, role_id);
				setRecentTasks(response || []);
			}
		};
		fetchDataForDashboard();
	}, []);

	useEffect(() => {
		// fetch all tasks of the recent tasks displayed in the dashboard
		const fetchAllTasks = async () => {
			const tasksData = {};
			for (const project of recentProjects) {
				const tasks = await getTasksByProjectId(project.id);
				tasksData[project.id] = tasks;
			}
			setProjectTasks(tasksData);
		};

		fetchAllTasks();
	}, [recentProjects]);

	return (
		<div className="w-full p-5">
			<div className="flex flex-col gap-4 justify-start items-start py-6 ">
				{recentProjects.length !== 0 && (
					<>
						<div className="w-full flex justify-between gap-4">
							<p className="font-semibold">My Recent Projects </p>
							<Link href="/project-listing" className="flex gap-2 items-center">
								<p className="text-primary">See all projects</p>
								<svg
									width="8"
									height="12"
									viewBox="0 0 8 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1.375 0.75L6.625 6L1.375 11.25"
										stroke="#307EF3"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</Link>
						</div>
						<div className="flex gap-4">
							{recentProjects.map((project) => {
								// show in progress and completed tasks based on task stage_id
								const tasks = projectTasks[project.id] || [];
								const tasksInProgress = tasks.filter(
									(task: any) => task.stage_id === 2
								).length;
								const tasksCompleted = tasks.filter(
									(task: any) => task.stage_id === 3
								).length;
								return (
									<div
										className="bg-white p-4 w-64 flex flex-col gap-10"
										key={project.id}
									>
										<div className="flex gap-4 justify-start items-start">
											{project.project_icon !== null ? (
												<Image
													src={project.project_icon}
													alt="profilePicture"
													width={50}
													height={40}
													className="object-cover rounded-full"
												/>
											) : (
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
											)}

											<div className="flex flex-col gap-2">
												<Link
													href={`/project-board/${project.id}`}
													className="font-semibold text-lg text-primary"
												>
													{project.project_name}
												</Link>
											</div>
										</div>
										<div className="flex flex-col gap-2">
											<div className="w-full rounded-md flex justify-between hover:bg-gray-300">
												<p className="text-sm text-grayText">
													Task In Progress
												</p>
												<p className="text-sm text-black font-semibold">
													{tasksInProgress}
												</p>
											</div>
											<div className="w-full rounded-md flex justify-between hover:bg-gray-300">
												<p className="text-sm text-grayText">Task Completed</p>
												<p className="text-sm text-black font-semibold">
													{tasksCompleted}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}

				{recentTasks.length !== 0 && (
					<>
						<div className="w-full flex justify-between gap-4">
							<p className="font-semibold">My Recent Tasks </p>
							<Link href="/project-listing" className="flex gap-2 items-center">
								<p className="text-primary">See all projects</p>
								<svg
									width="8"
									height="12"
									viewBox="0 0 8 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1.375 0.75L6.625 6L1.375 11.25"
										stroke="#307EF3"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</Link>
						</div>
						<div className="flex gap-4">
							{recentTasks.map((task) => {
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
										className="bg-white p-4 w-80 flex flex-col gap-10"
										key={task.id}
									>
										<div className="flex gap-4 justify-start items-start">
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

											<div className="flex flex-col gap-2">
												<Link
													href={`/task/${task.id}`}
													className="font-semibold text-lg text-primary"
												>
													{task.task_name}
												</Link>
												<p className="text-sm text-grayText">
													{task.stage_name}
												</p>
											</div>
										</div>
										<div className="flex justify-end">
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
														<rect width="18" height="69" rx="9" fill="#fff" />
														<rect
															y="77"
															width="18"
															height="19"
															rx="9"
															fill="#fff"
														/>
													</svg>
												</div>
												<p className={`text-sm text-${priorityColor}`}>
													{task.priority_name}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
			{roleId === 1 && (
				<div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
					<p className="text-infoDark font-bold text-4xl">Admin Login</p>
					<p className="text-primary text-xl font-normal">
						You can create, update, view and deactivate user accounts
					</p>
					<p className="text-primary text-xl font-normal">
						You can also create and update user roles and manage permissions for
						specific roles
					</p>
				</div>
			)}
		</div>
	);
}
