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

interface EditUserPageProps {
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
	errors: string[];
}

interface ErrorMsg {
	field: string;
	message: string;
}
export default function EditUserPage({ params }: EditUserPageProps) {
	const { data: session } = useSession();
	const loggedInId = session?.user.id;
	const loggedInEmail = session?.user.email;
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
	const [errors, setErrors] = useState<ErrorMsg[]>([]);
	const id = params.id;

	const [state, formAction] = useFormState<FormState>(editUserDetails, {
		message: null,
		success: false,
		errors: [],
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
		if (state?.success) {
			setMessage("User added successfully!");
		} else {
			setErrors(state.errors);
		}
	}, [id, state]);
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

	// Show error depending on field
	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
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
				<input type="hidden" value={id} name="id" />
				<input type="hidden" value={loggedInEmail} name="adminEmail" />
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
					{getErrorMessage("email") && (
						<div className="flex gap-1 items-center">
							<svg
								className="w-5 h-3"
								viewBox="0 0 18 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8.73281 1.9793C8.78906 1.88438 8.89102 1.82812 9 1.82812C9.10898 1.82812 9.21094 1.88438 9.26719 1.9793L16.2387 13.4297C16.2879 13.5105 16.3125 13.602 16.3125 13.6934C16.3125 13.9746 16.084 14.2031 15.8027 14.2031H2.19727C1.91602 14.2031 1.6875 13.9746 1.6875 13.6934C1.6875 13.5984 1.71211 13.507 1.76133 13.4297L8.73281 1.9793ZM7.29141 1.10039L0.319922 12.5508C0.108984 12.8953 0 13.2891 0 13.6934C0 14.9062 0.984375 15.8906 2.19727 15.8906H15.8027C17.0156 15.8906 18 14.9062 18 13.6934C18 13.2891 17.8875 12.8953 17.6801 12.5508L10.7086 1.10039C10.3465 0.50625 9.69961 0.140625 9 0.140625C8.30039 0.140625 7.65352 0.50625 7.29141 1.10039ZM10.125 11.9531C10.125 11.6548 10.0065 11.3686 9.79549 11.1576C9.58452 10.9467 9.29837 10.8281 9 10.8281C8.70163 10.8281 8.41548 10.9467 8.20451 11.1576C7.99353 11.3686 7.875 11.6548 7.875 11.9531C7.875 12.2515 7.99353 12.5376 8.20451 12.7486C8.41548 12.9596 8.70163 13.0781 9 13.0781C9.29837 13.0781 9.58452 12.9596 9.79549 12.7486C10.0065 12.5376 10.125 12.2515 10.125 11.9531ZM9.84375 5.48438C9.84375 5.0168 9.46758 4.64062 9 4.64062C8.53242 4.64062 8.15625 5.0168 8.15625 5.48438V8.85938C8.15625 9.32695 8.53242 9.70312 9 9.70312C9.46758 9.70312 9.84375 9.32695 9.84375 8.85938V5.48438Z"
									fill="#C92532"
								/>
							</svg>
							<p className="text-xs text-errorColor">
								{getErrorMessage("email")}
							</p>
						</div>
					)}
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
				{getErrorMessage("otherFields") && (
					<div className="flex gap-1 items-center">
						<svg
							className="w-5 h-3"
							viewBox="0 0 18 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.73281 1.9793C8.78906 1.88438 8.89102 1.82812 9 1.82812C9.10898 1.82812 9.21094 1.88438 9.26719 1.9793L16.2387 13.4297C16.2879 13.5105 16.3125 13.602 16.3125 13.6934C16.3125 13.9746 16.084 14.2031 15.8027 14.2031H2.19727C1.91602 14.2031 1.6875 13.9746 1.6875 13.6934C1.6875 13.5984 1.71211 13.507 1.76133 13.4297L8.73281 1.9793ZM7.29141 1.10039L0.319922 12.5508C0.108984 12.8953 0 13.2891 0 13.6934C0 14.9062 0.984375 15.8906 2.19727 15.8906H15.8027C17.0156 15.8906 18 14.9062 18 13.6934C18 13.2891 17.8875 12.8953 17.6801 12.5508L10.7086 1.10039C10.3465 0.50625 9.69961 0.140625 9 0.140625C8.30039 0.140625 7.65352 0.50625 7.29141 1.10039ZM10.125 11.9531C10.125 11.6548 10.0065 11.3686 9.79549 11.1576C9.58452 10.9467 9.29837 10.8281 9 10.8281C8.70163 10.8281 8.41548 10.9467 8.20451 11.1576C7.99353 11.3686 7.875 11.6548 7.875 11.9531C7.875 12.2515 7.99353 12.5376 8.20451 12.7486C8.41548 12.9596 8.70163 13.0781 9 13.0781C9.29837 13.0781 9.58452 12.9596 9.79549 12.7486C10.0065 12.5376 10.125 12.2515 10.125 11.9531ZM9.84375 5.48438C9.84375 5.0168 9.46758 4.64062 9 4.64062C8.53242 4.64062 8.15625 5.0168 8.15625 5.48438V8.85938C8.15625 9.32695 8.53242 9.70312 9 9.70312C9.46758 9.70312 9.84375 9.32695 9.84375 8.85938V5.48438Z"
								fill="#C92532"
							/>
						</svg>
						<p className="text-xs text-errorColor">
							{getErrorMessage("otherFields")}
						</p>
					</div>
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
