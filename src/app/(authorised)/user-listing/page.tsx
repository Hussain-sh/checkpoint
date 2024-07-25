"use client";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import getUsers from "@/app/actions/user-management/getUsersAction";
import Image from "next/image";
import defaultAvatar from "../../../../public/images/profilepictures/avatar.png";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	profile_picture: string;
	email: string;
	is_active: boolean;
	role_name: string;
}

export default function UserListingPage() {
	const [userData, setUserData] = useState<User[]>([]);
	const [searchText, setSearchText] = useState<string>("");
	const gridRef = useRef<AgGridReact>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const userDetails = await getUsers();
			setUserData(userDetails || []);
		};
		fetchUserData();
	}, []);

	// refactor the table data according to the columns
	const rowData = userData.map((user) => ({
		id: user.id,
		name: `${user.first_name} ${user.last_name}`,
		profile_picture: user.profile_picture,
		email: user.email,
		status: user.is_active == true ? "Active" : "Inactive",
		role_name: user.role_name,
		actions: "",
	}));

	const columnDefs: ColDef[] = [
		{ headerName: "Id", field: "id", sortable: false, hide: true },
		{
			headerName: "Name",
			field: "name",
			sortable: false,
			filter: true,
			maxWidth: 220,
			cellRenderer: (params: any) => {
				// show profile picture with name
				const profilePicture = params.data.profile_picture || defaultAvatar;
				const name = params.data.name;
				return (
					<div className="flex gap-2 justify-start items-center">
						<Image
							src={profilePicture}
							alt="profilePicture"
							width={20}
							height={20}
							className="object-cover rounded-full"
						/>
						<p className="text-sm py-2">{name}</p>
					</div>
				);
			},
		},
		{ headerName: "Email", field: "email", sortable: false, maxWidth: 280 },
		{
			headerName: "Role",
			field: "role_name",
			sortable: false,
			maxWidth: 180,
		},
		{
			headerName: "Status",
			field: "status",
			sortable: false,
			maxWidth: 180,
		},
		{
			headerName: "Actions",
			field: "actions",
			sortable: false,
			// maxWidth: 180,
			cellRenderer: (params: any) => {
				const userId = params.data.id;
				return (
					<div className="flex justify-center items-center gap-4 py-2">
						<Link href={`/users/edit/${userId}`} className="h-full w-full">
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
						</Link>
						<Link href={`/users/${userId}`} className="h-full w-full">
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
					</div>
				);
			},
		},
	];

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
				<div className="flex gap-4">
					<Link href="/users/add-user">
						<button className="px-4 py-2 text-white bg-primary text-center rounded-lg flex gap-2 justify-center items-center">
							Add User
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
					</Link>
				</div>
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
			</div>
		</>
	);
}
