"use client";
import { addPermissions } from "@/app/actions/role-management/addPermissions";
import getPermissionIdFromPermissionName from "@/app/actions/role-management/getPermissionIdFromPermissionName";
import { getPermissions } from "@/app/actions/role-management/getPermissions";
import { getRoleIdByRoleName } from "@/app/actions/role-management/getRoleIdByRoleName";
import { getRoles } from "@/app/actions/role-management/getRoles";
import getSelectedRolePermissions from "@/app/actions/role-management/getSelectedRolePermissions";
import { useState, useEffect } from "react";

interface PermissionTypes {
	id: number;
	permission_name: string;
}

export default function ManageRolesPage() {
	const [selectedRole, setSelectedRole] = useState("");
	const [roles, setRoles] = useState<{ role_name: string }[]>([]);
	const [permissions, setPermissions] = useState<PermissionTypes[]>([]);
	const [roleId, setRoleId] = useState<number | null>(null);
	const [checkedPermissions, setCheckedPermissions] = useState<{
		[key: string]: boolean;
	}>({});
	const [message, setMessage] = useState<string>("");
	const [selectedRolePermissions, setSelectedRolePermissions] = useState<
		string[]
	>([]);

	//fetch roles on page load
	useEffect(() => {
		const fetchRoles = async () => {
			const result = await getRoles();
			setRoles(result ?? []);
		};
		fetchRoles();
	}, []);

	// get role id from selected role and get all permissions
	useEffect(() => {
		const fetchRoleData = async () => {
			const roleData = await getRoleIdByRoleName(selectedRole);
			const permissionsData = await getPermissions();
			if (roleData?.id) {
				const response = await getSelectedRolePermissions(roleData?.id);
				setCheckedPermissions(
					response?.reduce((acc, permission) => {
						acc[permission.permission_name] = true;
						return acc;
					}, {})
				);
			}
			setRoleId(roleData?.id ?? null);
			setPermissions(permissionsData ?? []);
		};

		if (selectedRole) {
			fetchRoleData();
		}
	}, [selectedRole]);

	const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMessage("");
		setSelectedRole(e.target.value);
	};

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

		for (const permName of selectedPermissions) {
			const perm = await getPermissionIdFromPermissionName(permName);
			if (perm && perm.id) {
				const response = await addPermissions(roleId, perm.id);
				setMessage(response?.message || "");
			}
		}
	};

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-2 py-12 items-center justify-center">
				<div className="flex gap-2 justify-center">
					<label htmlFor="roles">Select a Role:</label>
					<select id="roles" value={selectedRole} onChange={handleRoleChange}>
						<option value="">Select...</option>
						{roles.map((role, index) => (
							<option key={index} value={role.role_name}>
								{role.role_name}
							</option>
						))}
					</select>
				</div>
			</div>
			{selectedRole && (
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
			)}
			<p className="text-green-500 text-sm">{message}</p>
			<button
				type="submit"
				className="bg-primary text-white text-center px-2 py-2 my-5"
			>
				Submit
			</button>
		</form>
	);
}
