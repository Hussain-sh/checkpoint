"use client";
import saveProfile from "@/app/actions/profile-management/saveProfileAction";
import ProfilePicture from "../../components/ProfilePicture";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getProfileDetails from "@/app/actions/profile-management/getProfileDetailsAction";

interface ProfileDetailsTypes {
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: string;
	phone_number: string;
	profile_picture: string;
}
export default function EditProfilePage() {
	const { data: session } = useSession();
	const email = session?.user?.email;
	const [profileDetails, setProfileDetails] = useState<ProfileDetailsTypes>({
		first_name: "",
		last_name: "",
		email: "",
		date_of_birth: "",
		phone_number: "",
		profile_picture: "",
	});

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [userEmail, setUserEmail] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [profilePicture, setProfilePicture] = useState<string>("");

	useEffect(() => {
		const fetchProfileDetails = async () => {
			if (email) {
				try {
					const details = await getProfileDetails(email);
					if (details) {
						const dateOfBirth = new Date(
							details.date_of_birth
						).toLocaleDateString();
						setProfileDetails(details);
						setFirstName(details.first_name);
						setLastName(details.last_name);
						setUserEmail(details.email);

						setDateOfBirth(dateOfBirth);
						setPhoneNumber(details.phone_number);
						setProfilePicture(details.profile_picture);
					} else {
						console.error("Profile details not found");
					}
				} catch (error) {
					console.error("Error fetching profile details:", error);
				}
			}
		};
		fetchProfileDetails();
	}, [email]);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		const formattedDate = new Date(newDate).toLocaleDateString();
		setDateOfBirth(formattedDate);
	};

	return (
		<div className="w-full flex justify-center items-center">
			<form
				className="w-4/5 h-auto flex flex-col gap-4 justify-start items-start p-12"
				action={saveProfile}
			>
				<div className="flex gap-2">
					<label htmlFor="firstName">FirstName:</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						className="formInputStyle pl-4"
						onChange={(e) => setFirstName(e.target.value)}
						value={firstName}
					/>
				</div>
				<div className="flex gap-2">
					<label htmlFor="lastName">LastName:</label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						className="formInputStyle pl-4"
						onChange={(e) => setLastName(e.target.value)}
						value={lastName}
					/>
				</div>
				<div className="flex gap-2">
					<label htmlFor="email">Email:</label>
					<input
						type="text"
						name="email"
						id="email"
						className="formInputStyle pl-4 w-72"
						onChange={(e) => setUserEmail(e.target.value)}
						value={userEmail}
					/>
				</div>
				<div className="flex gap-2">
					<label htmlFor="dob">Date of Birth:</label>
					<input
						type="date"
						name="dob"
						id="dob"
						className="formInputStyle pl-4"
						onChange={handleDateChange}
					/>
				</div>
				<div className="flex gap-2">
					<label htmlFor="phone">Phone number:</label>
					<input
						type="text"
						name="phone"
						id="phone"
						className="formInputStyle pl-4"
						onChange={(e) => setPhoneNumber(e.target.value)}
						value={phoneNumber}
					/>
				</div>
				<ProfilePicture
					label="Profile Picture"
					name="image"
					source={profileDetails.profile_picture}
				/>
				<button
					type="submit"
					className="px-2 py-2 bg-primary rounded-sm cursor-pointer text-white"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
