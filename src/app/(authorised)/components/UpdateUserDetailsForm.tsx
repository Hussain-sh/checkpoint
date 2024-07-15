//@ts-nocheck
"use client";
import saveProfile from "@/app/actions/profile-management/saveProfileAction";
import ProfilePicture from "./ProfilePicture";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getProfileDetails from "@/app/actions/profile-management/getProfileDetailsAction";
import { formateDate } from "@/utils/services/formatDate";
import { useFormState } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { evaluatePasswordStrength } from "@/utils/services/evaluatePasswordStrength";
import FormSubmitButton from "@/app/auth/components/FormSubmitButton";
import Link from "next/link";

interface ProfileDetailsTypes {
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: string;
	phone_number: string;
	profile_picture: string;
}

interface FormState {
	errors: [];
	success: boolean;
}

interface ErrorMsg {
	field: string;
	message: string;
}

interface PasswordConditions {
	length: boolean;
	lowercase: boolean;
	uppercase: boolean;
	number: boolean;
	special: boolean;
}

export default function UpdateUserDetailsForm() {
	const path = usePathname();
	const currentLink = path.split("/").pop();
	const router = useRouter();
	const { data: session } = useSession();
	const id = session?.user?.id;
	const sessionEmail = session?.user.email;
	const buttonText = currentLink === "add-user" ? "Add User" : "Update Profile"; // button text for form submit button
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
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [image, setImage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [errors, setErrors] = useState<ErrorMsg[]>([]);
	const [message, setMessage] = useState<string>("");
	const [state, formAction] = useFormState<FormState>(saveProfile, {
		success: false,
		errors: [],
	}); // update profile details
	const [showPasswordSuggestions, setShowPasswordSuggestions] =
		useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);
	const [strength, setStrength] = useState<string | undefined>("");
	const [passwordConditions, setPasswordConditions] =
		useState<PasswordConditions>({
			length: false,
			lowercase: false,
			uppercase: false,
			number: false,
			special: false,
		});

	// function for back button
	const goBack = () => {
		router.back();
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowPasswordSuggestions(true);
		setPassword(e.target.value);
		const { strength } = evaluatePasswordStrength(password);

		setStrength(strength);

		setPasswordConditions({
			length: password.length > 7,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /\d/.test(password),
			special: /[^A-Za-z0-9]/.test(password),
		});
	};

	const handleBlur = () => {
		setShowPasswordSuggestions(false);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	// Show error depending on field
	const getErrorMessage = (field: string) => {
		const error = errors.find((error) => error.field === field);
		return error ? error.message : null;
	};

	//Password strength color
	const getStrengthColor = (strength: string | undefined) => {
		switch (strength) {
			case "Weak":
				return "text-red-500";
			case "Medium":
				return "text-yellow-500";
			case "Strong":
				return "text-green-500";
			default:
				return "";
		}
	};

	useEffect(() => {
		setIsSubmitting(false);
		// fetch profile details only for edit profile page
		if (currentLink !== "add-user") {
			const fetchProfileDetails = async () => {
				if (id) {
					try {
						const details = await getProfileDetails(id);
						// get profile details
						if (details) {
							const dateOfBirth = formateDate(details.date_of_birth);
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
		}

		// if user added or profile updated show success message else show error
		if (state?.success) {
			setIsSubmitting(false);
			setMessage("User added successfully!");
		} else {
			setErrors(state.errors);
		}
	}, [currentLink, id, state]);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		const formattedDate = new Date(newDate).toLocaleDateString();
		setDateOfBirth(formattedDate);
	};

	const handleImagePicked = (pickedImage: string | null) => {
		setImage(pickedImage);
	};
	return (
		<>
			{showPasswordSuggestions && (
				<div className="absolute top-[73%] left-[18%] h-auto z-30 bg-white p-4 flex flex-col gap-1 justify-start items-start border rounded-md shadow-md my-1">
					<p className={`text-sm`}>
						Password strength:{" "}
						<span className={`${getStrengthColor(strength)}`}>{strength}</span>
					</p>
					<p
						className={`text-sm ${
							passwordConditions.length ? "text-green-500" : ""
						}`}
					>
						At least 8 characters
					</p>
					<p
						className={`text-sm ${
							passwordConditions.lowercase && passwordConditions.uppercase
								? "text-green-500"
								: ""
						}`}
					>
						Must contain small letters and capital letters
					</p>
					<p
						className={`text-sm ${
							passwordConditions.number && passwordConditions.special
								? "text-green-500"
								: ""
						}`}
					>
						Must contain a number and a special character (e.g., $)
					</p>
				</div>
			)}
			<div className="w-full flex flex-col">
				<div className="pl-24 pt-6">
					<button
						onClick={goBack}
						className="px-2 py-1 bg-primary cursor-pointer text-white rounded-full"
					>
						&larr;
					</button>
				</div>
				<div className="w-full flex flex-col justify-center items-center">
					<form
						className="w-4/5 h-auto flex flex-col gap-4 justify-start items-start p-12"
						action={formAction}
					>
						<input type="hidden" name="id" value={id} />
						{/* Admin Email for audit logs */}
						<input type="hidden" name="adminEmail" value={sessionEmail} />
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<label htmlFor="firstName">FirstName:</label>
								<span className="text-red-500">*</span>
								{getErrorMessage("firstName") && (
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
											{getErrorMessage("firstName")}
										</p>
									</div>
								)}
							</div>
							<input
								type="text"
								name="firstName"
								id="firstName"
								className="formInputStyle pl-4"
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<label htmlFor="firstName">LastName:</label>
								<span className="text-red-500">*</span>
								{getErrorMessage("lastName") && (
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
											{getErrorMessage("lastName")}
										</p>
									</div>
								)}
							</div>
							<input
								type="text"
								name="lastName"
								id="lastName"
								className="formInputStyle pl-4"
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<label htmlFor="firstName">Email:</label>
								<span className="text-red-500">*</span>
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
							<input
								type="text"
								name="email"
								id="email"
								className="formInputStyle pl-4 w-72"
								onChange={(e) => setUserEmail(e.target.value)}
								value={userEmail}
							/>
						</div>
						{currentLink === "add-user" && (
							<>
								<div className="flex flex-col gap-1 justify-start items-center">
									<div className="w-full flex justify-between items-center">
										<div className="flex gap-2 items-center">
											<label
												htmlFor="password"
												className="text-sm font-medium text-secondary"
											>
												Password
											</label>
											<span className="text-red-500">*</span>
										</div>

										{getErrorMessage("password") && (
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
													{getErrorMessage("password")}
												</p>
											</div>
										)}
									</div>
									<div className="w-full relative">
										<input
											type={showPassword ? "text" : "password"}
											className="w-full px-6 h-8 text-secondary text-base formInputStyle"
											name="password"
											onChange={handlePasswordChange}
											onBlur={handleBlur}
										/>
										{showPassword ? (
											<svg
												className="absolute right-6 top-2 w-4 h-4"
												viewBox="0 0 19 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												onClick={togglePasswordVisibility}
											>
												<path
													d="M6.1709 12.8499C7.1209 13.2099 8.12923 13.4049 9.15423 13.4049C12.0959 13.4049 14.8376 11.8449 16.7459 9.1449C17.4959 8.0874 17.4959 6.3099 16.7459 5.2524C16.4709 4.8624 16.1709 4.4949 15.8626 4.1499"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M14.0042 2.53C12.5458 1.54 10.8792 1 9.15417 1C6.2125 1 3.47083 2.56 1.5625 5.26C0.8125 6.3175 0.8125 8.095 1.5625 9.1525C2.22083 10.0825 2.9875 10.885 3.82083 11.53"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<circle
													cx="9.5"
													cy="7.5"
													r="3.25"
													stroke="#292D32"
													stroke-width="1.5"
												/>
											</svg>
										) : (
											<svg
												viewBox="0 0 24 24"
												fill="none"
												className="absolute right-6 top-2 w-4 h-4"
												xmlns="http://www.w3.org/2000/svg"
												onClick={togglePasswordVisibility}
											>
												<path
													d="M14.5299 9.46992L9.46992 14.5299C8.81992 13.8799 8.41992 12.9899 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C12.9899 8.41992 13.8799 8.81992 14.5299 9.46992Z"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M17.8198 5.76998C16.0698 4.44998 14.0698 3.72998 11.9998 3.72998C8.46984 3.72998 5.17984 5.80998 2.88984 9.40998C1.98984 10.82 1.98984 13.19 2.88984 14.6C3.67984 15.84 4.59984 16.91 5.59984 17.77"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M8.41992 19.5302C9.55992 20.0102 10.7699 20.2702 11.9999 20.2702C15.5299 20.2702 18.8199 18.1902 21.1099 14.5902C22.0099 13.1802 22.0099 10.8102 21.1099 9.40018C20.7799 8.88018 20.4199 8.39018 20.0499 7.93018"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M15.5104 12.7002C15.2504 14.1102 14.1004 15.2602 12.6904 15.5202"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M9.47 14.5298L2 21.9998"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M22.0003 2L14.5303 9.47"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										)}
									</div>
								</div>
								<div className="flex flex-col gap-1 justify-start items-center">
									<div className="w-full flex justify-between items-center">
										<div className="flex gap-2 items-center">
											<label
												htmlFor="confirm_password"
												className="text-sm font-medium text-secondary"
											>
												Confirm Password
											</label>
											<span className="text-red-500">*</span>
										</div>

										{getErrorMessage("confirmPassword") && (
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
													{getErrorMessage("confirmPassword")}
												</p>
											</div>
										)}
									</div>
									<div className="w-full relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											className="w-full px-6 h-8 text-secondary text-base formInputStyle"
											name="confirm_password"
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
										{showConfirmPassword ? (
											<svg
												className="absolute right-6 top-2 w-4 h-4"
												onClick={toggleConfirmPasswordVisibility}
												viewBox="0 0 19 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M6.1709 12.8499C7.1209 13.2099 8.12923 13.4049 9.15423 13.4049C12.0959 13.4049 14.8376 11.8449 16.7459 9.1449C17.4959 8.0874 17.4959 6.3099 16.7459 5.2524C16.4709 4.8624 16.1709 4.4949 15.8626 4.1499"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M14.0042 2.53C12.5458 1.54 10.8792 1 9.15417 1C6.2125 1 3.47083 2.56 1.5625 5.26C0.8125 6.3175 0.8125 8.095 1.5625 9.1525C2.22083 10.0825 2.9875 10.885 3.82083 11.53"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<circle
													cx="9.5"
													cy="7.5"
													r="3.25"
													stroke="#292D32"
													stroke-width="1.5"
												/>
											</svg>
										) : (
											<svg
												viewBox="0 0 24 24"
												fill="none"
												className="absolute right-6 top-2 w-4 h-4"
												xmlns="http://www.w3.org/2000/svg"
												onClick={toggleConfirmPasswordVisibility}
											>
												<path
													d="M14.5299 9.46992L9.46992 14.5299C8.81992 13.8799 8.41992 12.9899 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C12.9899 8.41992 13.8799 8.81992 14.5299 9.46992Z"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M17.8198 5.76998C16.0698 4.44998 14.0698 3.72998 11.9998 3.72998C8.46984 3.72998 5.17984 5.80998 2.88984 9.40998C1.98984 10.82 1.98984 13.19 2.88984 14.6C3.67984 15.84 4.59984 16.91 5.59984 17.77"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M8.41992 19.5302C9.55992 20.0102 10.7699 20.2702 11.9999 20.2702C15.5299 20.2702 18.8199 18.1902 21.1099 14.5902C22.0099 13.1802 22.0099 10.8102 21.1099 9.40018C20.7799 8.88018 20.4199 8.39018 20.0499 7.93018"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M15.5104 12.7002C15.2504 14.1102 14.1004 15.2602 12.6904 15.5202"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M9.47 14.5298L2 21.9998"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
												<path
													d="M22.0003 2L14.5303 9.47"
													stroke="#292D32"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										)}
									</div>
								</div>
							</>
						)}

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
							source={profileDetails.profile_picture}
							onImagePicked={handleImagePicked}
						/>
						{state.success && <p className="text-green-500">{message}</p>}

						<FormSubmitButton
							buttonText={buttonText}
							isSubmitting={isSubmitting}
						/>
					</form>
				</div>
			</div>
		</>
	);
}
