"use client";
import Image from "next/image";
import Link from "next/link";
import getUserDetails from "@/app/actions/user-management/getUserDetailsByIdAction";
import defaultAvatar from "../../../../../public/images/profilepictures/avatar.png";
import { formateDate } from "@/utils/services/formatDate";
import { useEffect, useState } from "react";

interface Params {
	id: string;
}

interface ViewUserPageProps {
	params: Params;
}

interface UserDataProps {
	first_name: string;
	last_name: string;
	email: string;
	role_name: string;
	date_of_birth: string;
	phone_number: string;
	profile_picture: string | null;
}
export default function ViewUserPage({ params }: ViewUserPageProps) {
	const [userData, setUserData] = useState<UserDataProps>({
		first_name: "",
		last_name: "",
		email: "",
		role_name: "",
		date_of_birth: "",
		phone_number: "",
		profile_picture: null,
	});
	const id = params.id;

	// get user data
	useEffect(() => {
		const fetchUserData = async () => {
			const userDetails = await getUserDetails(id);
			setUserData(userDetails);
		};

		fetchUserData();
	}, [id]);

	if (!userData) {
		throw new Error("User details not found");
	}
	const dateOfBirth = formateDate(userData.date_of_birth);
	return (
		<div className="flex flex-col">
			<div className="px-4 pt-6">
				<Link
					href="/user-listing"
					className="px-2 py-1 bg-primary cursor-pointer text-white rounded-full"
				>
					&larr;
				</Link>
			</div>
			<div className="w-4/5 p-4 flex flex-col gap-4 justify-center">
				<div>
					<p className="text-base">
						Name: {userData.first_name} {userData.last_name}
					</p>
				</div>
				<div>
					<p className="text-base">Email: {userData.email}</p>
				</div>
				<div>
					<p className="text-base">Role: {userData.role_name}</p>
				</div>
				<div>
					<p className="text-base">Date of Birth: {dateOfBirth}</p>
				</div>
				<div>
					<p className="text-base">Phone number: {userData.phone_number}</p>
				</div>
				<div className="flex flex-col gap-4">
					<p className="text-base">Profile Picture: </p>
					{userData.profile_picture !== null ? (
						<Image
							src={userData.profile_picture}
							alt="avatar"
							width={48}
							height={48}
							className="object-cover rounded-full"
						/>
					) : (
						<Image
							src={defaultAvatar}
							alt="avatar"
							width={48}
							height={48}
							className="object-cover rounded-full"
						/>
					)}
				</div>
			</div>
			<div className="flex gap-4 justify-center items-center">
				<Link
					href={`/users/edit/${id}`}
					className="px-2 py-2 bg-primary rounded-sm cursor-pointer text-white"
				>
					Edit user
				</Link>
			</div>
		</div>
	);
}
