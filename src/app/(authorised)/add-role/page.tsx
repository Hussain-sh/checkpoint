"use client";
import auditLogAction from "@/app/actions/auditLogAction";
import { addPermissions } from "@/app/actions/role-management/addPermissions";
import getPermissionIdFromPermissionName from "@/app/actions/role-management/getPermissionIdFromPermissionName";
import { getPermissions } from "@/app/actions/role-management/getPermissions";
import addNewRole from "@/app/actions/user-management/addNewRoleAction";
import getUserDetails from "@/app/actions/user-management/getUserDetailsByIdAction";
import FormSubmitButton from "@/app/auth/components/FormSubmitButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PermissionTypes {
	id: number;
	permission_name: string;
}

export default function AddRolePage() {
	const { data: session } = useSession();
	const id = String(session?.user?.id);
	const router = useRouter();
	const [permissions, setPermissions] = useState<PermissionTypes[]>([]);
	const [roleName, setRoleName] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [checkedPermissions, setCheckedPermissions] = useState<{
		[key: string]: boolean;
	}>({});
	const [message, setMessage] = useState<string>("");

	//fetch all roles
	useEffect(() => {
		const fetchRoles = async () => {
			const result = await getPermissions();
			setPermissions(result ?? []);
		};
		fetchRoles();
	}, []);

	// function for back button
	const goBack = () => {
		router.back();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// Add new role and get role id
			const response = await addNewRole(roleName);
			if (response?.success) {
				const roleId = response.roleId;
				if (!roleId) {
					throw new Error("Please provide a role");
				}

				const selectedPermissions = Object.keys(checkedPermissions).filter(
					(key) => checkedPermissions[key]
				);

				const permissionNames: string[] = [];
				// add selected permissions to the role
				for (const permName of selectedPermissions) {
					permissionNames.push(permName);
					const perm = await getPermissionIdFromPermissionName(permName);
					if (perm && perm.id) {
						const response = await addPermissions(roleId, perm.id);
						setMessage(response?.message || "");
					}
				}

				const adminUserDetails = await getUserDetails(id);
				const { email } = adminUserDetails;
				const auditLogData = {
					logType: "info",
					feature: "Role Management",
					action: `User with email ${email} created a new role - ${roleName} and assigned permissions: ${permissionNames.join(
						", "
					)}`,
					userId: id,
				};
				await auditLogAction(auditLogData);
				setIsSubmitting(false);
				setMessage("Role added and permissions assigned successfully!");
			} else {
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

	const handleCheckBoxClick = (permissionName: string) => {
		setCheckedPermissions((prevState) => ({
			...prevState,
			[permissionName]: !prevState[permissionName],
		}));
	};
	return (
		<>
			<div className="pl-24 pt-6">
				<button
					onClick={goBack}
					className="px-2 py-1 bg-primary cursor-pointer text-white rounded-full"
				>
					&larr;
				</button>
			</div>
			<div className="w-full flex flex-col gap-4 justify-center items-center py-12">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 justify-center items-center w-1/2"
				>
					<div className="flex gap-2">
						<label htmlFor="firstName">Role:</label>
						<input
							type="text"
							name="role"
							id="role"
							className="formInputStyle pl-4"
							onChange={(e) => setRoleName(e.target.value)}
							value={roleName}
						/>
					</div>
					<div className="flex flex-wrap p-4 gap-4">
						{permissions.map(({ id, permission_name }) => (
							<div className="flex flex-row-reverse gap-2" key={id}>
								<label htmlFor={permission_name}>{permission_name}: </label>
								<input
									type="checkbox"
									name={permission_name}
									id={permission_name}
									checked={checkedPermissions[permission_name] || false}
									onChange={() => handleCheckBoxClick(permission_name)}
								/>
							</div>
						))}
					</div>
					<p className="text-green-500">{message}</p>
					<FormSubmitButton buttonText="Add Role" isSubmitting={isSubmitting} />
				</form>
			</div>
		</>
	);
}
