import auditLogAction from "@/app/actions/auditLogAction";
import createProject, {
	addProjectTeam,
} from "@/app/actions/project-management/addProjectAction";
import {
	deleteProjectTeams,
	editProjectTeam,
} from "@/app/actions/project-management/editProjectAction";
import getProjectPriorities, {
	getProjectDetails,
	getProjectManagers,
	getTeamMembersFromProjectId,
	getUsersWithViewProjectPermissions,
} from "@/app/actions/project-management/getData";
import sendEmailOnProjectCreation from "@/app/actions/project-management/sendEmailAction";
import { getSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

interface ProjectDetailsType {
	id: number;
	first_name: string;
	last_name: string;
	priority_name: string;
	profile_picture: string;
	project_name: string;
}

interface ProjectPriority {
	id: number;
	priority_name: string;
}

interface DeveloperTypes {
	id: number;
	first_name: string;
	last_name: string;
	profile_picture: string;
}

interface ProjectManagertypes {
	id: number;
	first_name: string;
	last_name: string;
	profile_picture: string;
}

interface ErrorMsg {
	field: string;
	message: string;
}

interface ProjectDetailsTypes {
	project_name: string;
	first_name: string;
	last_name: string;
	profile_picture: string;
	project_description: string;
	project_icon: string;
	priority_name: string;
}

interface RowDataTypes {
	id: number | null;
	name: string;
	key: string;
	priority: string;
	lead: string;
	profile_picture: string;
	actions: string;
}

interface ProjectFormProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setMessage: (message: string) => void;
	projectId: number | null;
	onProjectUpdate: () => void;
}

interface SelectedTeamMembers {
	value: string | null;
	label: string | null;
}
interface DefaultValueTypes {
	value: number | string | null;
	label: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
	isOpen,
	setIsOpen,
	setMessage,
	projectId,
	onProjectUpdate,
}) => {
	const [projectDetails, setProjectDetails] = useState<ProjectDetailsTypes>({
		project_name: "",
		first_name: "",
		last_name: "",
		profile_picture: "",
		project_description: "",
		project_icon: "",
		priority_name: "",
	});

	const [teamMembers, setTeamMembers] = useState<DeveloperTypes[]>([]);

	const [projectPriorities, setProjectPriorities] = useState<ProjectPriority[]>(
		[]
	);
	const [projectManagers, setProjectManagers] = useState<ProjectManagertypes[]>(
		[]
	);
	const [
		teamMembersWithViewProjectPermissions,
		setTeamMembersWithViewProjectPermissions,
	] = useState<DeveloperTypes[]>([]);
	const [projectName, setProjectName] = useState<string>("");
	const [projectDesc, setProjectDesc] = useState<string>("");
	const [selectedprojectPriority, setSelectedProjectPririty] =
		useState<string>("");
	const [selectedProjectManager, setSelectedProjectManager] =
		useState<string>("");
	const [errors, setErrors] = useState<ErrorMsg[]>([]);
	const [pickedImage, setPickedImage] = useState<string | null>(null);
	const imageInput = useRef<HTMLInputElement>(null);
	const [selectedTeamMembers, setSelectedTeamMembers] = useState<
		SelectedTeamMembers[]
	>([]);
	const [projectIcon, setProjectIcon] = useState("");
	const [defaultValuesForMultiselect, setDefaultValuesForMultiSelect] =
		useState<DefaultValueTypes[]>([]);

	useEffect(() => {
		const fetchProjectPriorities = async () => {
			const response = await getProjectPriorities();
			setProjectPriorities(response || []);
		};

		const fetchProjectManagers = async () => {
			const response = await getProjectManagers();
			setProjectManagers(response || []);
		};

		const fetchTeamMembersWithViewProjectPermissions = async () => {
			const response = await getUsersWithViewProjectPermissions();
			setTeamMembersWithViewProjectPermissions(response || []);
		};

		const fetchTeamMembers = async () => {
			if (projectId) {
				const result = await getTeamMembersFromProjectId(projectId);
				setTeamMembers(result || []);
			}
		};

		if (projectId) {
			// get project details on edit of the project
			const fetchProjectDetails = async () => {
				const result = await getProjectDetails(projectId);
				setProjectDetails(result);
				setProjectName(result.project_name);
				setSelectedProjectPririty(result.priority_name);
				setProjectDesc(result.project_description);
				setSelectedProjectManager(`${result.first_name} ${result.last_name}`);
				setProjectIcon(result.project_icon);
			};
			fetchProjectDetails();
		}
		fetchProjectPriorities();
		fetchProjectManagers();
		fetchTeamMembersWithViewProjectPermissions();
		fetchTeamMembers();
	}, [isOpen, projectId]);

	// show the team members on on load of the edit form
	useEffect(() => {
		const defaultValues = teamMembers.map((team) => ({
			value: team.id,
			label: `${team.first_name} ${team.last_name}`,
		}));
		setDefaultValuesForMultiSelect(defaultValues);
	}, [teamMembers]);

	const handleSelectChange = (selectedOptions: any) => {
		setSelectedTeamMembers(selectedOptions);
	};

	// Values for the multi select dropdown
	const teamMembersOptions = teamMembersWithViewProjectPermissions.map(
		(team) => ({
			value: team.id,
			label: `${team.first_name} ${team.last_name}`,
		})
	);

	// function to handle image upload
	function handleImagePicked(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];

		if (!file) {
			setPickedImage(null);
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = () => {
			const result = fileReader.result;
			if (result && typeof result === "string") {
				setPickedImage(result);
			} else {
				setPickedImage(null);
			}
		};

		fileReader.readAsDataURL(file);
	}
	function handlePickClick() {
		if (imageInput.current) {
			imageInput.current.click();
		}
	}

	const handleProjectPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedProjectPririty(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const session = await getSession();
		const first_name = session?.user.first_name;
		const last_name = session?.user.last_name;
		const loggedInUserEmail = session?.user.email ?? "";
		const user_id = session?.user.id;

		const loggedInUserFullName = `${first_name} ${last_name}`;

		// project details for add project and edit project
		const projectDetails = {
			id: projectId,
			projectName: projectName,
			projectPriority: selectedprojectPriority,
			lead: selectedProjectManager,
			team: selectedTeamMembers,
			projectDescription: projectDesc,
			image: pickedImage || "",
			projectCreator: loggedInUserFullName,
			loggedInUserEmail: loggedInUserEmail,
			userId: user_id,
		};

		const result = await createProject(projectDetails);
		if (result?.success) {
			const teamMemberNames = selectedTeamMembers
				.map((member) => member.label)
				.join(", ");
			if (result.editTeams) {
				const projectId = result.projectId.id;
				if (selectedTeamMembers.length !== 0) {
					await deleteProjectTeams(projectId);
				}

				for (const dev of selectedTeamMembers) {
					await editProjectTeam(projectId, dev.value, selectedProjectManager);
				}
				setIsOpen(false);
				onProjectUpdate();
				setMessage("Project updated!");
				// audit logs to update team members for the project
				if (user_id && teamMemberNames.length !== 0) {
					const auditLogData = {
						logType: "info",
						feature: "Project management",
						action: `User with email ${loggedInUserEmail} updated ${teamMemberNames} as team members to project ${projectName}`,
						userId: user_id,
					};
					await auditLogAction(auditLogData);
				}
			} else {
				const projectId = result.projectId.id;
				for (const dev of selectedTeamMembers) {
					await addProjectTeam(projectId, dev.value, selectedProjectManager);
				}
				// audit logs to add team members for the project
				if (user_id) {
					const auditLogData = {
						logType: "info",
						feature: "Project management",
						action: `User with email ${loggedInUserEmail} added ${teamMemberNames} as team members to project ${projectName}`,
						userId: user_id,
					};
					await auditLogAction(auditLogData);
				}
				setIsOpen(false);
				setMessage("Project added!");
				await sendEmailOnProjectCreation(projectDetails); // send email after project created
			}
		} else {
			// setIsOpen(true);
			setErrors(result?.errors || []);
		}
	};

	// Show error depending on field
	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
	};
	return (
		<div className="w-full">
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-3 w-full justify-start items-center py-2"
			>
				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-2">
						<label htmlFor="projectName">Name:</label>
						<span className="text-red-500">*</span>
						{getErrorMessage("projectName") && (
							<p className="text-sm text-red-500">
								{getErrorMessage("projectName")}
							</p>
						)}
					</div>
					<input
						type="text"
						name="projectName"
						id="projectName"
						className="formInputStyle pl-4 w-1/2"
						onChange={(e) => setProjectName(e.target.value)}
						value={projectName}
					/>
				</div>
				<div className="flex gap-4 w-full">
					<div className="flex gap-2">
						<label htmlFor="projectPriority">Priority:</label>
						<span className="text-red-500">*</span>
					</div>

					<select
						id="projectPriority"
						name="projectPriority"
						className="border border-primaryBorder rounded-lg capitalize"
						value={selectedprojectPriority}
						onChange={handleProjectPriority}
					>
						<option value={selectedprojectPriority} selected>
							{selectedprojectPriority !== ""
								? selectedprojectPriority
								: "Select..."}
						</option>
						{projectPriorities.map((priority, index) => (
							<option key={index} value={priority.priority_name}>
								{priority.priority_name}
							</option>
						))}
					</select>
					{getErrorMessage("projectPriority") && (
						<p className="text-sm text-red-500">
							{getErrorMessage("projectPriority")}
						</p>
					)}
				</div>
				<div className="flex gap-4 w-full py-2">
					<div className="flex gap-2">
						<label htmlFor="team">Team:</label>
						<span className="text-red-500">*</span>
					</div>
					{projectId && defaultValuesForMultiselect.length !== 0 && (
						<Select
							closeMenuOnSelect={false}
							components={animatedComponents}
							isMulti
							options={teamMembersOptions}
							defaultValue={defaultValuesForMultiselect}
							onChange={handleSelectChange}
							name="team"
						/>
					)}
					{!projectId && (
						<Select
							closeMenuOnSelect={false}
							components={animatedComponents}
							isMulti
							options={teamMembersOptions}
							onChange={handleSelectChange}
						/>
					)}

					{getErrorMessage("team") && (
						<p className="text-sm text-red-500">{getErrorMessage("team")}</p>
					)}
				</div>
				<div className="flex gap-4 w-full">
					<div className="flex gap-2">
						<label htmlFor="projectLead">Lead:</label>
						<span className="text-red-500">*</span>
					</div>

					<select
						id="lead"
						name="lead"
						className="border border-primaryBorder rounded-lg"
						value={selectedProjectManager}
						onChange={(e) => setSelectedProjectManager(e.target.value)}
					>
						<option value={selectedProjectManager} selected>
							{selectedProjectManager !== ""
								? selectedProjectManager
								: "Select..."}
						</option>
						{projectManagers.map((manager, index) => (
							<option
								key={index}
								value={`${manager.first_name} ${manager.last_name}`}
							>
								{`${manager.first_name} ${manager.last_name}`}
							</option>
						))}
					</select>
					{getErrorMessage("lead") && (
						<p className="text-sm text-red-500">{getErrorMessage("lead")}</p>
					)}
				</div>
				<div className="flex flex-col gap-4 w-full">
					<label htmlFor="projectDescription">Description:</label>
					<textarea
						name="projectDescription"
						id="projectDescription"
						className="formInputStyle w-4/5 h-24 pl-4 bg-primaryBorder"
						placeholder="Type project description"
						onChange={(e) => setProjectDesc(e.target.value)}
						value={projectDesc}
					></textarea>
				</div>
				<div className="flex flex-col w-full gap-3">
					<label htmlFor="image" className="font-semibold">
						Upload Icon
					</label>
					<div className="flex items-start gap-6 mb-4">
						<div className="w-24 h-24 border border-[#a4abb9] flex items-center justify-center text-center tex-[#a4abb9] relative">
							{!pickedImage && projectIcon === null && (
								<p className="m-0 p-1">No Image picked yet</p>
							)}
							{pickedImage && (
								<Image
									src={pickedImage}
									alt="Image picked by the user"
									objectFit="cover"
									fill
								/>
							)}
							{projectIcon && (
								<Image
									src={projectIcon}
									alt="Image picked by the user"
									objectFit="cover"
									fill
								/>
							)}
						</div>
						<input
							type="file"
							id="image"
							name="image"
							className="hidden"
							accept="image/*"
							ref={imageInput}
							onChange={handleImagePicked}
						/>
						<button
							type="button"
							className="px-2 py-2 bg-primary rounded-sm cursor-pointer text-white"
							onClick={handlePickClick}
						>
							Pick an Image
						</button>
					</div>
				</div>
				<div className="flex gap-4">
					<button type="submit" className="bg-primary p-2 text-white">
						{projectId ? "Edit" : "Create"}
					</button>
					<button className="bg-iconColor p-2 text-white" onClick={setIsOpen}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProjectForm;
