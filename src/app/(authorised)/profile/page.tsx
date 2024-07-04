import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";
import Image from "next/image";
import getProfileDetails from "@/app/actions/profile-management/getProfileDetailsAction";
import defaultAvatar from "../../../../public/images/profilepictures/avatar.png";

interface ProfileDetails {
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: string;
	phone_number: string;
	profile_picture: string;
}

export default async function ProfilePage() {
	try {
		const session = await getServerSession(options);
		if (!session?.user?.email) {
			throw new Error("User not authenticated");
		}
		const email = session?.user?.email;
		const profileDetails: ProfileDetails = await getProfileDetails(email);

		if (!profileDetails) {
			throw new Error("Profile details not found");
		}
		const dateOfBirth = new Date(
			profileDetails.date_of_birth
		).toLocaleDateString();
		return (
			<div className="flex flex-col">
				<div className="w-4/5 p-4 flex flex-col gap-4 justify-start">
					<div>
						<p className="text-base">FirstName: {profileDetails.first_name}</p>
					</div>
					<div>
						<p className="text-base">LastName: {profileDetails.last_name}</p>
					</div>
					<div>
						<p className="text-base">Email: {profileDetails.email}</p>
					</div>
					<div>
						<p className="text-base">Date of Birth: {dateOfBirth}</p>
					</div>
					<div>
						<p className="text-base">
							Phone number: {profileDetails.phone_number}
						</p>
					</div>
					<div className="flex flex-col gap-4">
						<p className="text-base">Profile Picture: </p>
						{profileDetails.profile_picture != null ? (
							<Image
								src={profileDetails.profile_picture}
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
				<div className="flex justify-center items-center">
					<Link
						href="/profile/edit"
						className="px-2 py-2 bg-primary rounded-sm cursor-pointer text-white"
					>
						Edit Details
					</Link>
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
