"use client";

import {
	getSubTasks,
	getTaskDetails,
} from "@/app/actions/task-management/getData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import defaultAvatar from "../../../../../public/images/profilepictures/avatar.png";
import Link from "next/link";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { createSubTask } from "@/app/actions/task-management/addTaskAction";
interface Params {
	id: number;
}

interface ViewTaskPageProps {
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

interface ErrorMsg {
	field: string;
	message: string;
}

interface SubTasks {
	id: number | null;
	sub_task_name: string;
	sub_task_description: string;
}

export default function ViewTaskPage({ params }: ViewTaskPageProps) {
	const id = params.id;
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

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [subTaskDescription, setSubTaskDescription] = useState<string>("");
	const [subTaskName, setSubTaskName] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [errors, setErrors] = useState<ErrorMsg[]>([]);
	const [subTasks, setSubTasks] = useState<SubTasks[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const subTaskDetails = {
			subTaskName: subTaskName,
			subTaskDescription: subTaskDescription,
			taskId: id,
		};
		const result = await createSubTask(subTaskDetails);
		if (result?.success) {
			setMessage("Sub Task Created");
			setIsOpen(false);
		} else {
			setErrors(result?.errors || []);
		}
	};

	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
	};
	useEffect(() => {
		const fetchTaskDetails = async () => {
			const response = await getTaskDetails(id);
			setTaskDetails(response);
		};

		const fetchSubTasks = async () => {
			const response = await getSubTasks(id);
			setSubTasks(response || []);
		};
		fetchSubTasks();
		fetchTaskDetails();
	}, [id]);

	let assigneeName = `${taskDetails.assignee_first_name} ${taskDetails.assignee_last_name}`;
	let creatorName = `${taskDetails.creator_first_name} ${taskDetails.creator_last_name}`;

	let priorityColor = "primary";
	let svgColor = "bg-primary";
	if (taskDetails.priority_name === "medium") {
		priorityColor = "yellow-500";
		svgColor = "bg-yellow-300";
	} else if (taskDetails.priority_name === "high") {
		priorityColor = "errorColor";
		svgColor = "bg-errorColor";
	}
	return (
		<div className="w-full p-5 flex gap-5">
			<div className="w-3/4 bg-white p-5 flex flex-col gap-4 justify-start items-start rounded-lg">
				<div className="w-full flex justify-between items-center ">
					<p className="text-lg font-bold">{taskDetails.task_name}</p>
					<div className="flex gap-4 items-center">
						<Link
							href={`/task/edit/${id}`}
							className="px-4 py-2 text-white text-sm bg-primary rounded-lg text-center flex gap-2 items-center"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1 19H19M11.7844 3.31171C11.7844 3.31171 11.7844 4.94634 13.419 6.58096C15.0537 8.21559 16.6883 8.21559 16.6883 8.21559M5.31963 15.9881L8.75234 15.4977C9.2475 15.4269 9.70636 15.1975 10.06 14.8438L18.3229 6.58096C19.2257 5.67818 19.2257 4.21449 18.3229 3.31171L16.6883 1.67708C15.7855 0.774305 14.3218 0.774305 13.419 1.67708L5.15616 9.93996C4.80248 10.2936 4.57305 10.7525 4.50231 11.2477L4.01193 14.6804C3.90295 15.4432 4.5568 16.097 5.31963 15.9881Z"
									stroke="white"
									stroke-width="1.5"
									stroke-linecap="round"
								/>
							</svg>
							Edit Task
						</Link>
					</div>
				</div>
				<div className="flex flex-col justify-start gap-4">
					<p className="text-lg font-bold">Description</p>
					<p className="text-sm">{taskDetails.task_description}</p>
				</div>
				<hr className="w-full border" />
				<div className="w-full">
					<p className="text-lg font-semibold capitalize">Sub Tasks</p>
					{subTasks.map((sub_task) => {
						return (
							<>
								<div
									className="bg-white p-4 w-full flex flex-col gap-10 border border-primaryBorder shadow-md"
									key={sub_task.id}
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
											<p className="font-semibold text-lg text-primary">
												{sub_task.sub_task_name}
											</p>
										</div>
									</div>
									<p className="text-base text-grayText">
										{sub_task.sub_task_description}
									</p>
									<div className="flex justify-end">
										<div className="flex gap-2 items-center justify-end py-2">
											<div
												className={`w-5 h-5 flex justify-center items-center text-white rounded-full`}
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
										</div>
									</div>
								</div>
							</>
						);
					})}
				</div>
			</div>
			<div className="w-1/4 flex flex-col gap-4">
				<div className="w-full bg-white py-4 rounded-lg">
					<p className="px-4 font-bold text-lg py-2">Details</p>
					<hr className="w-full border" />
					<div className=" w-full pt-2 flex justify-between items-stretch px-4">
						<p className="capitalise">Status</p>
						<div className="min-w-min px-2 py-1 bg-primaryBorder text-black rounded-md flex justify-center items-center">
							<p className="font-semibold text-sm">{taskDetails.stage_name}</p>
						</div>
					</div>
					<div className=" w-full pt-2 flex justify-between items-center px-4">
						<p className="capitalise">Priority</p>
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
									<rect y="77" width="18" height="19" rx="9" fill="#fff" />
								</svg>
							</div>
							<p className={`text-sm text-${priorityColor}`}>
								{taskDetails.priority_name}
							</p>
						</div>
					</div>
				</div>
				<div className="w-full bg-white py-4 rounded-lg">
					<div className="py-2 flex flex-col gap-2">
						<p className="px-4 font-bold text-lg">Assignee</p>
						<hr className="w-full border" />
						<div className="flex gap-2 justify-start items-center px-4">
							{taskDetails.assignee_profile_picture !== null ? (
								<Image
									src={taskDetails.assignee_profile_picture}
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

							<p className="text-sm py-2">{assigneeName}</p>
						</div>
					</div>
					<div className="py-2 flex flex-col gap-2">
						<p className="px-4 font-bold text-lg">Created By</p>
						<hr className="w-full border" />
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
					</div>
				</div>
				<div className="w-full p-2">
					<button
						className="w-full bg-primary px-2 py-2 text-white rounded-lg"
						onClick={() => setIsOpen(true)}
					>
						Create Sub task
					</button>
				</div>
			</div>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 flex w-screen items-center justify-end p-2">
					<DialogPanel className="w-1/2 space-y-4 border bg-white p-4">
						<DialogTitle className="font-bold">Create Sub Task</DialogTitle>
						<hr className="w-full bg-black border" />
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<div className="flex gap-2">
									<label htmlFor="projectName">Name:</label>
									<span className="text-red-500">*</span>
									{getErrorMessage("subTaskName") && (
										<p className="text-sm text-red-500">
											{getErrorMessage("subTaskName")}
										</p>
									)}
								</div>
								<div className="flex flex-col">
									<input
										type="text"
										name="projectName"
										id="projectName"
										className="formInputStyle pl-4 w-1/2"
										onChange={(e) => setSubTaskName(e.target.value)}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 justify-start">
								<div className="flex flex-col gap-4 w-full">
									<label htmlFor="subTaskDescription">Description:</label>
									<textarea
										name="subTaskDescription"
										id="subTaskDescription"
										className="formInputStyle w-4/5 h-24 pl-4 bg-primaryBorder"
										placeholder="Type Sub Task Description"
										onChange={(e) => setSubTaskDescription(e.target.value)}
									></textarea>
								</div>
							</div>
							<div className="flex gap-4 py-4">
								<button
									type="submit"
									className="bg-primary p-2 text-white rounded-md"
								>
									Create
								</button>
								<button
									className="bg-iconColor p-2 text-white rounded-md"
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
	);
}
