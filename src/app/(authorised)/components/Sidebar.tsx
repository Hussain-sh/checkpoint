"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../assets/images/logo.png";
import SideBarIcons from "./SidebarIcons";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getSelectedRolePermissions from "@/app/actions/role-management/getSelectedRolePermissions";

export default function Sidebar() {
	const [isProjectsTabAllowed, setIsProjectsTabAllowed] = useState(false);
	const [isUsersTabAllowed, setIsUsersTabAllowed] = useState(false);
	const [isRolesTabAllowed, setIsRolesTabAllowed] = useState(false);

	const { data: session } = useSession();
	const roleId = session?.user?.role_id || 1;

	useEffect(() => {
		const getPermissionsbyRole = async () => {
			const getPermissions = await getSelectedRolePermissions(roleId);
			const hasViewProjectPermission = getPermissions?.some((permission) =>
				permission.permission_slug.includes("view-project")
			);
			const hasViewUsersPermissions = getPermissions?.some((permission) =>
				permission.permission_slug.includes("view-user")
			);

			setIsProjectsTabAllowed(hasViewProjectPermission || false);
			setIsUsersTabAllowed(hasViewUsersPermissions || false);
			setIsRolesTabAllowed(hasViewUsersPermissions || false);
		};
		getPermissionsbyRole();
	}, [roleId]);
	return (
		<div className="w-1/4 bg-white h-screen px-4 flex flex-col justify-start items-start">
			<div className="flex justify-start items-center h-20 w-full">
				<Link href="/" className="flex gap-2 items-center font-bold">
					<Image src={logo} alt="logo" className="w-14 h-14" />
					Checkpoint
				</Link>
			</div>
			<div className="w-full flex flex-col justify-between items-start h-full py-6">
				<SideBarIcons
					isProjectsTabAllowed={isProjectsTabAllowed}
					isUsersTabAllowed={isUsersTabAllowed}
					isRolesTabAllowed={isRolesTabAllowed}
				/>
				<button
					type="submit"
					className="px-4 py-2 w-full rounded-lg text-sm capitalize text-white bg-primary flex gap-2 justify-center items-center"
					onClick={() => signOut({ callbackUrl: "/" })}
				>
					<svg
						width="29"
						height="28"
						viewBox="0 0 29 28"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M16.6686 14.8983C17.1791 14.8983 17.5826 14.5016 17.5826 14C17.5826 13.51 17.1791 13.1016 16.6686 13.1016H9.54655V7.52496C9.54655 4.66663 11.9087 2.33329 14.8288 2.33329H20.6095C23.5177 2.33329 25.8799 4.65496 25.8799 7.51329V20.475C25.8799 23.345 23.5059 25.6666 20.5977 25.6666H14.805C11.9087 25.6666 9.54655 23.345 9.54655 20.4866V14.8983H16.6686ZM5.31132 18.0364L1.90465 14.6414C1.72965 14.4664 1.63632 14.2447 1.63632 13.9997C1.63632 13.7664 1.72965 13.5331 1.90465 13.3697L5.31132 9.97472C5.48632 9.79972 5.71965 9.70639 5.94132 9.70639C6.17465 9.70639 6.40798 9.79972 6.58298 9.97472C6.93298 10.3247 6.93298 10.8964 6.58298 11.2464L4.71632 13.1014H9.54632V14.8981H4.71632L6.58298 16.7531C6.93298 17.1031 6.93298 17.6747 6.58298 18.0247C6.23298 18.3864 5.66132 18.3864 5.31132 18.0364Z"
							fill="white"
						/>
					</svg>
					Logout
				</button>
			</div>
		</div>
	);
}
