"use client";
import auditLogAction from "@/app/actions/auditLogAction";
import { addPermissions } from "@/app/actions/role-management/addPermissions";
import { deletePermissionsByRoleId } from "@/app/actions/role-management/deletePermissions";
import getPermissionIdFromPermissionName from "@/app/actions/role-management/getPermissionIdFromPermissionName";
import { getPermissions } from "@/app/actions/role-management/getPermissions";
import getRoleNameByRoleId from "@/app/actions/role-management/getRoleNameByRoleId";
import getSelectedRolePermissions from "@/app/actions/role-management/getSelectedRolePermissions";
import updateRole from "@/app/actions/role-management/updateRoleAction";
import getUserDetails from "@/app/actions/user-management/getUserDetailsByIdAction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Params {
	id: number;
}

interface RoleParamsProps {
	params: Params;
}

interface PermissionTypes {
	id: number;
	permission_name: string;
}

export default function ManageRolesPage({ params }: RoleParamsProps) {
	const { data: session } = useSession();
	const userId = String(session?.user?.id);
	const router = useRouter();
	const [role, setRole] = useState<string>("");
	const [permissions, setPermissions] = useState<PermissionTypes[]>([]);
	const [checkedPermissions, setCheckedPermissions] = useState<{
		[key: string]: boolean;
	}>({});
	const [message, setMessage] = useState<string>("");
	const id = params.id;

	// function for back button
	const goBack = () => {
		router.back();
	};
	// get role name from id and get all permissions
	useEffect(() => {
		const fetchRole = async () => {
			const result = await getRoleNameByRoleId(id);
			setRole(result || { role_name: "" });
		};

		const fetchRoleData = async () => {
			const permissionsData = await getPermissions();
			if (id) {
				const response = await getSelectedRolePermissions(id); // permissions for the selected role
				setCheckedPermissions(
					response?.reduce((acc, permission) => {
						acc[permission.permission_name] = true;
						return acc;
					}, {})
				);
			}
			setPermissions(permissionsData ?? []);
		};

		fetchRole();
		fetchRoleData();
	}, [id]);

	// toggle state of permissions on click of checkbox
	const handleCheckBoxClick = (permissionName: string) => {
		setCheckedPermissions((prevState) => ({
			...prevState,
			[permissionName]: !prevState[permissionName],
		}));
	};

	// fetch all checked permissions and role and add to the database
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const selectedPermissions = Object.keys(checkedPermissions).filter(
			(key) => checkedPermissions[key]
		);

		await updateRole(role, id);
		const permissionNames: string[] = [];
		// delete all permissions for the role selected and update new permissions
		await deletePermissionsByRoleId(id);
		for (const permName of selectedPermissions) {
			permissionNames.push(permName);
			const perm = await getPermissionIdFromPermissionName(permName);
			if (perm && perm.id) {
				const response = await addPermissions(id, perm.id);
				setMessage(response?.message || "");
			}
		}

		const adminUserDetails = await getUserDetails(userId);
		const { email } = adminUserDetails;
		const auditLogData = {
			logType: "info",
			feature: "Role Management",
			action: `User with email ${email} updated role - ${role} and assigned permissions: ${permissionNames.join(
				", "
			)}`,
			userId: userId,
		};
		await auditLogAction(auditLogData);
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
			<form
				className="flex flex-col justify-center items-center"
				onSubmit={handleSubmit}
			>
				<div className="flex gap-2">
					<label htmlFor="firstName">Role:</label>
					<input
						type="text"
						name="role"
						id="role"
						className="formInputStyle pl-4"
						value={role}
						onChange={(e) => setRole(e.target.value)}
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

				<p className="text-green-500 text-sm">{message}</p>
				<button
					type="submit"
					className="bg-primary text-white text-center px-2 py-2 my-5"
				>
					Submit
				</button>
			</form>
		</>
	);
}
