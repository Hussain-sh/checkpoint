"use client";

import { getTaskDetails } from "@/app/actions/task-management/getData";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultAvatar from "../../../../../public/images/profilepictures/avatar.png";
import Link from "next/link";

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

	useEffect(() => {
		const fetchTaskDetails = async () => {
			const response = await getTaskDetails(id);
			setTaskDetails(response);
		};
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
			</div>
		</div>
	);
}
