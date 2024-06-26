"use client";
import { updatePasswordAction } from "@/app/actions/authentication/updatePasswordAction";
import { evaluatePasswordStrength } from "@/utils/services/evaluatePasswordStrength";
import Link from "next/link";
import { useState } from "react";

interface Params {
	token: string;
}

interface ResetPasswordPageProps {
	params: Params;
}

interface PasswordConditions {
	length: boolean;
	lowercase: boolean;
	uppercase: boolean;
	number: boolean;
	special: boolean;
}
export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);
	const [showPasswordSuggestions, setShowPasswordSuggestions] =
		useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [strength, setStrength] = useState<string | undefined>("");
	const [passwordConditions, setPasswordConditions] =
		useState<PasswordConditions>({
			length: false,
			lowercase: false,
			uppercase: false,
			number: false,
			special: false,
		});
	const [showMsg, setShowMsg] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await updatePasswordAction({
			newPassword,
			confirmPassword,
			token: params.token,
		});
		setError(response?.type || "");
		if (response?.success) {
			setShowMsg(true);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowPasswordSuggestions(true);
		setNewPassword(e.target.value);
		const { strength } = evaluatePasswordStrength(newPassword);

		setStrength(strength);

		setPasswordConditions({
			length: newPassword.length > 7,
			lowercase: /[a-z]/.test(newPassword),
			uppercase: /[A-Z]/.test(newPassword),
			number: /\d/.test(newPassword),
			special: /[^A-Za-z0-9]/.test(newPassword),
		});
	};
	const handleBlur = () => {
		setShowPasswordSuggestions(false);
	};

	const toggleNewPasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

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

	return (
		<>
			{showPasswordSuggestions && (
				<div className="absolute top-1/2 right-[35%] h-auto z-30 bg-white p-4 flex flex-col gap-1 justify-start items-start border rounded-md shadow-md my-1">
					<p className="text-sm">
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
			<div className="w-1/3 flex justify-center items-center bg-white z-20 h-auto rounded-xl p-10 relative">
				<div className="w-16 h-16 bg-white border border-primaryBorder rounded-full flex justify-center items-center absolute -top-8">
					<svg
						className="w-8 h-8"
						viewBox="0 0 54 54"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							opacity="0.4"
							d="M40.89 1.12977C42.37 2.63613 42.37 5.08246 40.89 6.58882L21.9457 25.8702C20.4657 27.3766 18.0622 27.3766 16.5821 25.8702L7.11001 16.2295C5.63 14.7232 5.63 12.2768 7.11001 10.7705C8.59003 9.26412 10.9936 9.26412 12.4736 10.7705L19.2699 17.6756L35.5382 1.12977C37.0183 -0.37659 39.4218 -0.37659 40.9018 1.12977H40.89Z"
							fill="#546FFF"
						/>
						<path
							d="M52.8701 17.1131C54.3766 18.5973 54.3766 21.0075 52.8701 22.4916L22.0164 52.8869C20.5099 54.371 18.0633 54.371 16.5567 52.8869L1.1299 37.6893C-0.376632 36.2051 -0.376632 33.7949 1.1299 32.3107C2.63642 30.8266 5.08303 30.8266 6.58955 32.3107L19.2926 44.8132L47.4225 17.1131C48.929 15.629 51.3756 15.629 52.8822 17.1131H52.8701Z"
							fill="#2A3BB7"
						/>
					</svg>
				</div>
				<div className="w-full flex flex-col gap-2 justify-center items-center pt-2">
					<div className="px-2 text-secondary flex flex-col gap-2">
						<h1 className="text-3xl text-center font-semibold capitalize">
							Reset Password
						</h1>
						<p className="text-sm text-center font-thin">
							Set your new password below
						</p>
						{showMsg && (
							<p className="text-base text-center font-normal text-infoDark">
								Password updated successfully{" "}
								<Link className="text-primary px-2" href="/auth/login">
									Back to Login page
								</Link>
							</p>
						)}
					</div>
					<form
						onSubmit={handleSubmit}
						className="w-full flex flex-col gap-6 py-4"
					>
						<div className="flex flex-col gap-3 justify-start items-center">
							<div className="w-full flex justify-between items-center">
								<label
									htmlFor="password"
									className="text-base font-medium text-secondary"
								>
									New Password
								</label>
							</div>
							<div className="w-full relative">
								<input
									type={showPassword ? "text" : "password"}
									className="w-full px-6 h-10 text-secondary text-base formInputStyle"
									name="password"
									onChange={handlePasswordChange}
									onBlur={handleBlur}
								/>
								{showPassword ? (
									<svg
										className="absolute right-6 top-2"
										width="24"
										height="24"
										onClick={toggleNewPasswordVisibility}
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
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										className="absolute right-6 top-2"
										xmlns="http://www.w3.org/2000/svg"
										onClick={toggleNewPasswordVisibility}
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
						<div className="flex flex-col gap-3 justify-start items-center">
							<div className="w-full flex justify-between items-center">
								<label
									htmlFor="confirm_password"
									className="text-base font-medium text-secondary"
								>
									Confirm Password
								</label>
								{error === "password" && (
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
											Passwords do not match
										</p>
									</div>
								)}
								{error === "token" && (
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
										<p className="text-xs text-errorColor">Invalid Token</p>
									</div>
								)}
							</div>
							<div className="w-full relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									className="w-full px-6 h-10 text-secondary text-base formInputStyle"
									name="confirm_password"
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								{showConfirmPassword ? (
									<svg
										width="24"
										height="24"
										className="absolute right-6 top-2"
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
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										className="absolute right-6 top-2"
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
						<div className="flex flex-col gap-2 items-center justify-center ">
							<button
								type="submit"
								className="w-full py-2 bg-primary text-white text-sm font-medium text-center rounded-full"
							>
								Reset Password
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
