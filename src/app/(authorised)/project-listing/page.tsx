"use client";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import defaultAvatar from "../../../../public/images/profilepictures/avatar.png";

import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import {
	getAllProjects,
	getArchivedProjects,
	getProjectDetails,
} from "@/app/actions/project-management/getData";

import { deleteProject } from "@/app/actions/project-management/deleteProjectAction";
import { useSession } from "next-auth/react";
import getSelectedRolePermissions from "@/app/actions/role-management/getSelectedRolePermissions";
import PriorityFilter from "../components/PriorityFilter";
import ProjectForm from "../components/ProjectForm";
import auditLogAction from "@/app/actions/auditLogAction";

interface ProjectDetailsType {
	id: number;
	first_name: string;
	last_name: string;
	priority_name: string;
	profile_picture: string;
	project_name: string;
	is_archived: boolean;
}

interface RowData {
	id: number;
	name: string;
	key: string;
	priority: string;
	lead: string;
	profile_picture: string;
	actions: string;
	is_archived: boolean;
}

export default function ProjectListingPage() {
	const { data: session } = useSession();
	const role_id = session?.user.role_id || 1;
	const loggedInUserEmail = session?.user.email;
	const user_id = session?.user.id;
	const [projectData, setProjectData] = useState<ProjectDetailsType[]>([]);
	const [searchText, setSearchText] = useState<string>("");
	let [isOpen, setIsOpen] = useState(false);
	let [openEditBox, setOpenEditBox] = useState(false);
	let [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
	const [message, setMessage] = useState<string>("");
	const gridRef = useRef<AgGridReact>(null);
	const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
	const [rowData, setRowData] = useState<RowData[]>([]);
	const [hasEditPermissions, setHasEditPermissions] = useState<boolean>(false);
	const [hasDeletePermissions, setHasDeletePermissions] =
		useState<boolean>(false);
	const [hasCreatePermissions, setHasCreatePermissions] =
		useState<boolean>(false);
	const [projectId, setProjectId] = useState<number | null>(null);

	const openDialogueBox = (id: any) => {
		setDeleteProjectId(id);
		setIsDeleteBoxOpen(true);
	};
	const [isArchived, setIsArchived] = useState<boolean>(false);

	const handleDelete = async () => {
		const projectDetails = await getProjectDetails(deleteProjectId); // project details for audit logs
		const result = await deleteProject(deleteProjectId);
		if (user_id) {
			const auditLogData = {
				logType: "info",
				feature: "Project management",
				action: `User with email ${loggedInUserEmail} archived project: ${projectDetails.project_name}`,
				userId: user_id,
			};
			await auditLogAction(auditLogData);
		}
		const updatedProjects = projectData.filter(
			(project) => project.id !== deleteProjectId
		);
		const updatedData = updatedProjects.map((project) => ({
			id: project.id,
			name: project.project_name,
			key: project.project_name.substring(0, 3),
			priority: project.priority_name,
			lead: `${project.first_name} ${project.last_name}`,
			profile_picture: project.profile_picture,
			actions: "",
			is_archived: project.is_archived,
		}));
		setRowData(updatedData);
		if (result?.success) {
			setMessage("Project moved to archive");
		}
		setIsDeleteBoxOpen(false);
	};

	const fetchProjects = async () => {
		const response = await getAllProjects();
		setProjectData(response || []);
	};

	useEffect(() => {
		const getPermissionsbyRole = async () => {
			const getPermissions = await getSelectedRolePermissions(role_id);
			setHasEditPermissions(
				getPermissions?.some((permission) =>
					permission.permission_slug.includes("edit-project")
				) || false
			);
			setHasDeletePermissions(
				getPermissions?.some((permission) =>
					permission.permission_slug.includes("delete-project")
				) || false
			);
			setHasCreatePermissions(
				getPermissions?.some((permission) =>
					permission.permission_slug.includes("add-project")
				) || false
			);
		};

		fetchProjects();
		getPermissionsbyRole();
	}, [isOpen, role_id]);

	useEffect(() => {
		// refactor the table data according to the columns
		const updatedData = projectData.map((project) => ({
			id: project.id,
			name: project.project_name,
			key: project.project_name.substring(0, 3),
			priority: project.priority_name,
			lead: `${project.first_name} ${project.last_name}`,
			profile_picture: project.profile_picture,
			actions: "",
			is_archived: project.is_archived,
		}));

		setRowData(updatedData);
	}, [projectData]);

	useEffect(() => {
		setMessage("");
		if (isArchived === true) {
			const archivedProjects = async () => {
				const response = await getArchivedProjects();
				setProjectData(response || []);
			};

			archivedProjects();
			// refactor the table data according to the columns
			const updatedData = projectData.map((project) => ({
				id: project.id,
				name: project.project_name,
				key: project.project_name.substring(0, 3),
				priority: project.priority_name,
				lead: `${project.first_name} ${project.last_name}`,
				profile_picture: project.profile_picture,
				actions: "",
				is_archived: project.is_archived,
			}));

			setRowData(updatedData);
		} else {
			fetchProjects();
		}
	}, [isArchived]);

	const handleProjectUpdate = () => {
		fetchProjects();
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleEditBoxClose = () => {
		setOpenEditBox(false);
	};

	const handleSuccessMessage = (text: string) => {
		setMessage(text);
	};

	const handleEditBox = (id: number) => {
		setProjectId(id);
		setOpenEditBox(true);
	};

	const handleCreateProjectBox = () => {
		setProjectId(null);
		setIsOpen(true);
	};

	const columnDefs: ColDef[] = [
		{ headerName: "Id", field: "id", sortable: false, hide: true },
		{
			headerName: "Project Name",
			field: "name",
			sortable: false,
			filter: true,
			maxWidth: 220,
		},
		{
			headerName: "Key",
			field: "key",
			sortable: false,
			maxWidth: 180,
		},
		{
			headerName: "Project Priority",
			field: "priority",
			sortable: false,
			filter: "agSetColumnFilter",
			maxWidth: 180,
			cellRenderer: (params: any) => {
				const value = params.data.priority;
				const className = value.toLowerCase() + "-priority";

				return (
					<p className={`flex gap-2 justify-start items-center ${className}`}>
						{value}
					</p>
				);
			},
		},
		{
			headerName: "Lead",
			field: "lead",
			sortable: false,
			maxWidth: 180,
			cellRenderer: (params: any) => {
				// show profile picture with name
				const profilePicture = params.data.profile_picture || defaultAvatar;
				const lead = params.data.lead;
				return (
					<div className="flex gap-2 justify-start items-center">
						<Image
							src={profilePicture}
							alt="profilePicture"
							width={20}
							height={20}
							className="object-cover rounded-full"
						/>
						<p className="text-sm py-2">{lead}</p>
					</div>
				);
			},
		},
		{
			headerName: "Actions",
			field: "actions",
			sortable: false,
			// maxWidth: 180,
			cellRenderer: (params: any) => {
				const id = params.data.id;
				return (
					<div className="flex justify-center items-center gap-4 py-2">
						{hasEditPermissions && (
							<button
								onClick={() => handleEditBox(id)}
								className="h-full w-full"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.81366 16.6899L15.1357 7.2212C15.5336 6.71059 15.6751 6.12025 15.5424 5.51916C15.4275 4.97271 15.0914 4.45314 14.5874 4.05899L13.3582 3.08255C12.2882 2.23153 10.9618 2.32111 10.2013 3.29755L9.37887 4.36446C9.27276 4.49793 9.29929 4.69501 9.43193 4.80251C9.43193 4.80251 11.51 6.46872 11.5542 6.50455C11.6957 6.63892 11.8018 6.81808 11.8284 7.03308C11.8726 7.45411 11.5808 7.84827 11.1475 7.90201C10.9441 7.92889 10.7495 7.86618 10.608 7.74973L8.42383 6.01185C8.31771 5.93213 8.15854 5.94915 8.07011 6.05664L2.87928 12.7752C2.54325 13.1963 2.42829 13.7427 2.54325 14.2712L3.20647 17.1468C3.24184 17.2991 3.37449 17.4066 3.53366 17.4066L6.45185 17.3707C6.98242 17.3618 7.47763 17.1199 7.81366 16.6899ZM11.8997 15.7944H16.6581C17.1224 15.7944 17.5 16.1769 17.5 16.6472C17.5 17.1184 17.1224 17.5 16.6581 17.5H11.8997C11.4355 17.5 11.0579 17.1184 11.0579 16.6472C11.0579 16.1769 11.4355 15.7944 11.8997 15.7944Z"
										fill="#3983F4"
									/>
								</svg>
							</button>
						)}

						<Link href={`/project-board/${id}`} className="h-full w-full">
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M6.74829 9.99998C6.74829 11.7778 8.20358 13.2242 10.0003 13.2242C11.7889 13.2242 13.2442 11.7778 13.2442 9.99998C13.2442 8.21412 11.7889 6.76766 10.0003 6.76766C8.20358 6.76766 6.74829 8.21412 6.74829 9.99998ZM14.7808 5.03836C16.2036 6.13735 17.415 7.74543 18.2849 9.75756C18.3499 9.91109 18.3499 10.0889 18.2849 10.2343C16.545 14.2586 13.4475 16.6666 10.0003 16.6666H9.9922C6.55317 16.6666 3.45561 14.2586 1.71577 10.2343C1.65073 10.0889 1.65073 9.91109 1.71577 9.75756C3.45561 5.73331 6.55317 3.33331 9.9922 3.33331H10.0003C11.7239 3.33331 13.358 3.93129 14.7808 5.03836ZM10.0013 12.0103C11.1151 12.0103 12.0257 11.1053 12.0257 9.9982C12.0257 8.88305 11.1151 7.978 10.0013 7.978C9.90374 7.978 9.80618 7.98608 9.71675 8.00224C9.68423 8.89113 8.95252 9.60224 8.05008 9.60224H8.00943C7.98504 9.73154 7.96878 9.86083 7.96878 9.9982C7.96878 11.1053 8.87935 12.0103 10.0013 12.0103Z"
									fill="#3983F4"
								/>
							</svg>
						</Link>
						{hasDeletePermissions && (
							<button
								onClick={() => openDialogueBox(id)}
								className="h-full w-full"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 384 512"
									fill="#3983f4"
								>
									<path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM96 48c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8l14.8 0c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4c0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5 .7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0z" />
								</svg>
							</button>
						)}
					</div>
				);
			},
		},
	];

	const onFilterChange = (priority: string) => {
		// filter data as per priority
		const api = gridRef?.current?.api;
		if (priority === "All") {
			api?.setFilterModel(null); // Clear filter
		} else {
			api?.setFilterModel({
				priority: {
					type: "equals",
					filter: priority,
				},
			});
		}
		api?.onFilterChanged();
	};

	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		gridRef.current?.api.setQuickFilter(e.target.value);
	};

	return (
		<>
			<div className="w-full h-auto flex justify-between items-center gap-4 py-4 px-10">
				<input
					type="text"
					placeholder="Search by name"
					value={searchText}
					onChange={onSearchChange}
					className="px-4 py-2 border rounded"
				/>
				<div className="flex gap-3">
					<PriorityFilter onFilterChange={onFilterChange} />
					<button
						className="px-4 py-2 text-white bg-primary rounded-lg text-center flex gap-2 justify-center items-center"
						onClick={() => setIsArchived(!isArchived)}
					>
						{isArchived ? "Show UnArchived" : "Show Archived"}
					</button>

					{hasCreatePermissions && (
						<button
							className="px-4 py-2 text-white bg-primary rounded-lg text-center flex gap-2 justify-center items-center"
							onClick={handleCreateProjectBox}
						>
							Create Project
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
					)}
				</div>
			</div>
			<div className="flex justify-center items-center">
				<p className="text-green-500">{message}</p>
			</div>
			<div className="h-[80vh] w-full px-10">
				<div className="ag-theme-quartz mx-auto w-full h-full overflow-auto ">
					<AgGridReact
						ref={gridRef}
						rowData={rowData}
						columnDefs={columnDefs}
						pagination={true}
						paginationPageSize={10}
					/>
				</div>
				<Dialog
					open={isOpen}
					onClose={() => setIsOpen(false)}
					className="relative z-50"
				>
					<div className="fixed inset-0 flex w-screen items-center justify-end p-2">
						<DialogPanel className="w-1/2 space-y-4 border bg-white p-4">
							<DialogTitle className="font-bold">Create Project</DialogTitle>
							<hr className="w-full bg-black border" />
							{/* form for edit project and add project */}
							<ProjectForm
								isOpen={isOpen}
								setIsOpen={handleClose}
								setMessage={handleSuccessMessage}
								projectId={projectId}
								onProjectUpdate={handleProjectUpdate}
							/>
						</DialogPanel>
					</div>
				</Dialog>

				<Dialog
					open={openEditBox}
					onClose={() => setOpenEditBox(false)}
					className="relative z-50"
				>
					<div className="fixed inset-0 flex w-screen items-center justify-end p-2">
						<DialogPanel className="w-1/2 space-y-4 border bg-white p-4">
							<DialogTitle className="font-bold">Edit Project</DialogTitle>
							<hr className="w-full bg-black border" />
							<ProjectForm
								isOpen={openEditBox}
								setIsOpen={handleEditBoxClose}
								setMessage={handleSuccessMessage}
								projectId={projectId}
								onProjectUpdate={handleProjectUpdate}
							/>
						</DialogPanel>
					</div>
				</Dialog>

				<Dialog
					open={isDeleteBoxOpen}
					as="div"
					className="relative z-10 focus:outline-none"
					onClose={() => setIsDeleteBoxOpen(false)}
				>
					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<DialogPanel
								transition
								className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
							>
								<DialogTitle
									as="h3"
									className="text-base/7 font-medium text-black"
								>
									Archive Project
								</DialogTitle>
								<p className="mt-2 text-sm/6 text-black">
									Are you sure you wat to archive this project??
								</p>
								<div className="mt-4 flex gap-2">
									<Button
										className="inline-flex items-center gap-2 rounded-md bg-primary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
										onClick={handleDelete}
									>
										Move to Archive
									</Button>
									<Button
										className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
										onClick={() => setIsDeleteBoxOpen(false)}
									>
										Cancel
									</Button>
								</div>
							</DialogPanel>
						</div>
					</div>
				</Dialog>
			</div>
		</>
	);
}
