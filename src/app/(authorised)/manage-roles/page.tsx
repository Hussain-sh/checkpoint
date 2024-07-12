"use client";
import React, { useEffect, useState } from "react";
import { getRoles } from "@/app/actions/role-management/getRoles";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Link from "next/link";
import getSelectedRolePermissions from "@/app/actions/role-management/getSelectedRolePermissions";

interface Role {
	id: number;
	role_name: string;
	permissions?: string;
}

const RolesPage: React.FC = () => {
	const [roles, setRoles] = useState<Role[]>([]);
	useEffect(() => {
		const fetchRoles = async () => {
			const rolesData: Role[] = (await getRoles()) ?? [];

			for (let role of rolesData) {
				const permissions = await getSelectedRolePermissions(role.id); // get permissions for evvery role
				const permissionNames =
					permissions?.map((p) => p.permission_name) ?? []; // get all permission names for every role
				const truncatedPermissions =
					permissionNames.length > 4
						? permissionNames?.slice(0, 4).join(", ") + "..."
						: permissionNames?.join(", "); // separacte permission names with commas and if permissions are more than 4 add ...
				role.permissions = truncatedPermissions;
			}

			setRoles(rolesData);
		};

		fetchRoles();
	}, []);

	const columnDefs: ColDef[] = [
		{ headerName: "Id", field: "id", sortable: false, hide: true },
		{
			headerName: "Role",
			field: "role_name",
			sortable: false,
		},
		{
			headerName: "Permissions",
			field: "permissions",
			sortable: false,
			minWidth: 600,
		},
		{
			headerName: "Actions",
			field: "actions",
			sortable: false,
			cellRenderer: (params: any) => {
				const id = params.data.id;
				return (
					<div className="flex justify-center items-center gap-4">
						<Link href={`/roles/${id}`} className="h-full w-full">
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clip-rule="evenodd"
									d="M7.81366 16.6899L15.1357 7.2212C15.5336 6.71059 15.6751 6.12025 15.5424 5.51916C15.4275 4.97271 15.0914 4.45314 14.5874 4.05899L13.3582 3.08255C12.2882 2.23153 10.9618 2.32111 10.2013 3.29755L9.37887 4.36446C9.27276 4.49793 9.29929 4.69501 9.43193 4.80251C9.43193 4.80251 11.51 6.46872 11.5542 6.50455C11.6957 6.63892 11.8018 6.81808 11.8284 7.03308C11.8726 7.45411 11.5808 7.84827 11.1475 7.90201C10.9441 7.92889 10.7495 7.86618 10.608 7.74973L8.42383 6.01185C8.31771 5.93213 8.15854 5.94915 8.07011 6.05664L2.87928 12.7752C2.54325 13.1963 2.42829 13.7427 2.54325 14.2712L3.20647 17.1468C3.24184 17.2991 3.37449 17.4066 3.53366 17.4066L6.45185 17.3707C6.98242 17.3618 7.47763 17.1199 7.81366 16.6899ZM11.8997 15.7944H16.6581C17.1224 15.7944 17.5 16.1769 17.5 16.6472C17.5 17.1184 17.1224 17.5 16.6581 17.5H11.8997C11.4355 17.5 11.0579 17.1184 11.0579 16.6472C11.0579 16.1769 11.4355 15.7944 11.8997 15.7944Z"
									fill="#3983F4"
								/>
							</svg>
						</Link>
					</div>
				);
			},
		},
	];

	return (
		<>
			<div className="w-full h-auto flex justify-end items-center gap-4 py-4 px-10">
				<Link href="/add-role">
					<button className="px-2 py-2 text-white bg-primary text-center">
						Add Role
					</button>
				</Link>
			</div>
			<div className="h-[80vh] w-full px-10">
				<div className="ag-theme-quartz mx-auto w-full h-full overflow-auto ">
					<AgGridReact rowData={roles} columnDefs={columnDefs} />
				</div>
			</div>
		</>
	);
};

export default RolesPage;
