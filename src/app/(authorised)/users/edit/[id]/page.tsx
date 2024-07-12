//@ts-nocheck
"use client";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import getUserDetails from "@/app/actions/user-management/getUserDetailsByIdAction";
import defaultAvatar from "../../../../../../public/images/profilepictures/avatar.png";
import { formateDate } from "@/utils/services/formatDate";
import { useState, useEffect } from "react";
import ProfilePicture from "@/app/(authorised)/components/ProfilePicture";
import { getRoles } from "@/app/actions/role-management/getRoles";
import editUserDetails from "@/app/actions/user-management/editUserDetailsAction";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Params {
	id: string;
}

interface ViewUserPageProps {
	params: Params;
}

interface UserDetailsTypes {
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: Date | string;
	phone_number: string;
	profile_picture: string;
	is_active: boolean;
}

interface FormState {
	message: string;
	success: boolean;
}
export default function EditUserPage({ params }: ViewUserPageProps) {
	const { data: session } = useSession();
	const loggedInId = session?.user.id;
	const [userDetails, setUserDetails] = useState<UserDetailsTypes>({
		first_name: "",
		last_name: "",
		email: "",
		date_of_birth: "",
		phone_number: "",
		profile_picture: "",
		is_active: false,
	});

	const [userId, setUserId] = useState<number | null>(null);
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [userEmail, setUserEmail] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [profilePicture, setProfilePicture] = useState<string>("");
	const [isActive, setIsActive] = useState<boolean>(false);
	const [roles, setRoles] = useState<{ role_name: string }[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [image, setImage] = useState<string | null>(null);
	const [message, setMessage] = useState<string>("");
	const id = params.id;

	const [state, formAction] = useFormState<FormState>(editUserDetails, {
		message: null,
		success: false,
	});

	// fetch user details on load of page
	useEffect(() => {
		setMessage("");
		const fetchRoles = async () => {
			const result = await getRoles();
			setRoles(result ?? []);
		};

		const fetchUserDetails = async () => {
			const details = await getUserDetails(id);
			if (details) {
				const dateOfBirth = formateDate(details.date_of_birth);
				setUserDetails(details);
				setUserId(details.id);
				setFirstName(details.first_name);
				setLastName(details.last_name);
				setUserEmail(details.email);
				setDateOfBirth(dateOfBirth);
				setPhoneNumber(details.phone_number);
				setProfilePicture(details.profile_picture);
				setSelectedRole(details.role_name);
				setIsActive(details.is_active);
			} else {
				console.error("Profile details not found");
			}
		};
		fetchRoles();
		fetchUserDetails();
	}, [id]);
	const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRole(e.target.value);
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		const formattedDate = new Date(newDate).toLocaleDateString();
		setDateOfBirth(formattedDate);
	};

	const handleImagePicked = (pickedImage: string | null) => {
		setImage(pickedImage);
	};
	return (
		<div className="w-full flex flex-col justify-center items-center">
			<div className="w-4/5 flex justify-start items-center py-4">
				<Link
					href="/user-listing"
					className="px-2 py-1 bg-primary cursor-pointer text-white rounded-full"
				>
					&larr;
				</Link>
			</div>
			<form
				action={formAction} // update user details action
				className="w-4/5 h-auto flex flex-col gap-4 justify-start items-start px-12"
			>
				<div className="hidden">
					<input type="hidden" value={id} name="id" />
				</div>
				<div className="flex gap-2">
					<label htmlFor="firstName">FirstName:</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						className="formInputStyle pl-4"
						onChange={(e) => setFirstName(e.target.value)}
						value={firstName}
						required
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
						required
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
						required
					/>
				</div>
				<div className="flex flex-col gap-2 py-12 items-center justify-center">
					<div className="flex gap-2 justify-center">
						<label htmlFor="roles">Select a Role:</label>
						<select
							id="roles"
							name="role"
							value={selectedRole}
							onChange={handleRoleChange}
						>
							<option value="">Select...</option>
							{roles.map((role, index) => (
								<option key={index} value={role.role_name}>
									{role.role_name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex gap-2">
					<label htmlFor="dob">Date of Birth:</label>
					<input
						type="date"
						name="dob"
						id="dob"
						className="formInputStyle pl-4"
						onChange={handleDateChange}
						defaultValue={dateOfBirth}
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
					source={userDetails.profile_picture}
					onImagePicked={handleImagePicked}
				/>
				{loggedInId !== userId && (
					<div className="flex gap-2">
						<label htmlFor="is_active">Status</label>
						<Switch checked={isActive} onChange={setIsActive} as={Fragment}>
							{({ checked, disabled }) => (
								<button
									className={clsx(
										"group inline-flex h-6 w-11 items-center rounded-full",
										checked ? "bg-blue-600" : "bg-gray-200",
										disabled && "cursor-not-allowed opacity-50"
									)}
								>
									<span className="sr-only">Enable notifications</span>
									<span
										className={clsx(
											"size-4 rounded-full bg-white transition",
											checked ? "translate-x-6" : "translate-x-1"
										)}
									/>
								</button>
							)}
						</Switch>
						<input
							type="hidden"
							name="isActive"
							value={isActive ? "true" : "false"}
						/>
					</div>
				)}

				<div className="flex justify-center items-center">
					<p className="text-base text-green-500">{message}</p>
				</div>
				{state.success ? (
					<p className="text-green-500">{state.message}</p>
				) : (
					<p className="text-red-500">{state.message}</p>
				)}
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
