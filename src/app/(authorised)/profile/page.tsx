import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";
import Image from "next/image";
import getProfileDetails from "@/app/actions/profile-management/getProfileDetailsAction";
import defaultAvatar from "../../../../public/images/profilepictures/avatar.png";

interface ProfileDetails {
	first_name: string;
	last_name: string;
	role_name: string;
	email: string;
	date_of_birth: Date;
	phone_number: string;
	profile_picture: string;
}

function formatDate(dateString: any) {
	const date = new Date(dateString);

	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "long" });
	const year = date.getFullYear();

	const dayWithSuffix = day + getDaySuffix(day);

	return `${dayWithSuffix} ${month} ${year}`;
}

function getDaySuffix(day: any) {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

export default async function ProfilePage() {
	try {
		// get profile data from the session object
		const session = await getServerSession(options);
		const id = session?.user?.id;
		if (!id) {
			throw new Error("User not authenticated");
		}

		const profileDetails: ProfileDetails = await getProfileDetails(id);

		if (!profileDetails) {
			throw new Error("Profile details not found");
		}
		const dateOfBirth = formatDate(profileDetails.date_of_birth);
		return (
			<div className="flex flex-col gap-4 w-full p-10">
				<div className="w-full flex justify-between p-10 bg-white rounded-lg">
					<div className="flex gap-2">
						<div>
							{profileDetails.profile_picture != null ? (
								<Image
									src={profileDetails.profile_picture}
									alt="avatar"
									width={100}
									height={80}
									className="object-cover rounded-full"
								/>
							) : (
								<Image
									src={defaultAvatar}
									alt="avatar"
									width={100}
									height={80}
									className="object-cover rounded-full"
								/>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<p className="text-lg font-semibold">
								{profileDetails.first_name}
							</p>
							<div className="flex gap-2">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8 6V5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V6M2 10.3475C2 10.3475 5.11804 12.4244 9.97767 12.9109M22 10.3475C22 10.3475 18.882 12.4244 14.0223 12.9109M6 22H18C20.2091 22 22 20.2091 22 18V10C22 7.79086 20.2091 6 18 6H6C3.79086 6 2 7.79086 2 10V18C2 20.2091 3.79086 22 6 22Z"
										stroke="#16151C"
										stroke-width="1.5"
										stroke-linecap="round"
									/>
									<path
										d="M14 12.16V13.16C14 13.17 14 13.17 14 13.18C14 14.27 13.99 15.16 12 15.16C10.02 15.16 10 14.28 10 13.19V12.16C10 11.16 10 11.16 11 11.16H13C14 11.16 14 11.16 14 12.16Z"
										stroke="#16151C"
										stroke-width="1.5"
										stroke-miterlimit="10"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>

								<p>{profileDetails.role_name}</p>
							</div>
							<p className="text-primary">Active</p>
						</div>
					</div>

					<div className="flex  gap-2 justify-start">
						<Link
							href="/profile/edit"
							className="px-4 py-2 bg-primary cursor-pointer text-white h-10 flex gap-2 justify-center items-center rounded-md"
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
							Edit Details
						</Link>
						{/* <button className="px-2 py-2 rounded-md text-white bg-primary w-40 h-10">
							Reset Password
						</button> */}
					</div>
				</div>
				<div className="flex flex-col gap-4 justify-start p-10">
					<div className="flex gap-2 items-center">
						<svg
							width="14"
							height="18"
							viewBox="0 0 14 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M7 8C9.20914 8 11 6.20914 11 4C11 1.79086 9.20914 0 7 0C4.79086 0 3 1.79086 3 4C3 6.20914 4.79086 8 7 8ZM7 18C10.866 18 14 16.2091 14 14C14 11.7909 10.866 10 7 10C3.13401 10 0 11.7909 0 14C0 16.2091 3.13401 18 7 18Z"
								fill="#3983F4"
							/>
						</svg>
						<p className="text-primary">Personal Information</p>
					</div>
					<hr className="w-full px-5" />
					<div className="w-3/4 flex gap-20 flex-wrap justify-start">
						<div className="flex flex-col gap-3 justify-start  ">
							<p className="text-grayText">First Name</p>
							<p className="font-normal">{profileDetails.first_name}</p>
						</div>
						<div className="flex flex-col gap-3 justify-start  ">
							<p className="text-grayText">Last Name</p>
							<p className="font-normal">{profileDetails.last_name}</p>
						</div>
						<div className="flex flex-col gap-3 justify-start  ">
							<p className="text-grayText">Email</p>
							<p className="font-normal">{profileDetails.email}</p>
						</div>
						<div className="flex flex-col gap-3 justify-start  ">
							<p className="text-grayText">Date of Birth</p>
							<p className="font-normal">{dateOfBirth}</p>
						</div>
						<div className="flex flex-col gap-3 justify-start  ">
							<p className="text-grayText">Phone Number</p>
							<p className="font-normal">{profileDetails.phone_number}</p>
						</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Error fetching profile details:", error);
		return (
			<div className="flex flex-col justify-center items-center">
				<p className="text-red-500">Failed to load profile details.</p>
			</div>
		);
	}
}
