"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FormSubmitButton from "../components/FormSubmitButton";
import auditLogAction from "@/app/actions/auditLogAction";

export default function LoginPage() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const errorParam = searchParams.get("error");
	const token = searchParams.get("token");

	const handleSubmit = async (e: React.FormEvent) => {
		setError("");
		e.preventDefault();
		setIsEmailVerified(false);
		setIsSubmitting(true);
		try {
			const result = await signIn("credentials", {
				email: email,
				password: password,
				callbackUrl: "/",
				redirect: false,
			});

			if (result?.ok) {
				router.push("/dashboard");
				const auditLogData = {
					logType: "info",
					feature: "Authentication",
					action: `User with email ${email} logged in with correct credentials`,
					userId: null,
				};
				await auditLogAction(auditLogData);
			} else {
				setIsSubmitting(false);
				const auditLogData = {
					logType: "warning",
					feature: "Authentication",
					action: `User with email ${email} tried to log in with wrong credentials`,
					userId: null,
				};
				await auditLogAction(auditLogData);
				setError(result?.error || "Invalid Details... Please try again");
			}
		} catch (error) {
			setIsSubmitting(false);
			setError("Submission failed");
		}
	};

	// email verification
	useEffect(() => {
		if (token) {
			fetch(`/api/auth/verify-email?token=${token}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.message === "Verification successful") {
						setIsEmailVerified(true);
					} else {
						setIsEmailVerified(false);
						console.error("Verification failed", data);
						router.push("/auth/login?error=verification_failed");
					}
				})
				.catch((error) => {
					console.error("Error verifying email:", error);
					router.push("/auth/login?error=verification_failed");
				});
		}
	}, [token, errorParam, router]);
	return (
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
						Log In
					</h1>
					<p className="text-sm text-center font-thin">
						Please login using your email and password
					</p>
				</div>
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col gap-6 py-4"
				>
					<div className="flex flex-col gap-3 justify-start items-center">
						<div className="w-full flex justify-between items-center">
							<label
								htmlFor="email"
								className="text-base font-medium text-secondary"
							>
								Email
							</label>
							{(error === "email" || error === "password") && (
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
										Invalid Details... Please try again
									</p>
								</div>
							)}
							{error === "verification" && (
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
										Email verification failed. Please try again.
									</p>
								</div>
							)}
							{isEmailVerified === true && (
								<div className="flex gap-1 items-center">
									<p className="text-xs text-green-500">
										Email verification successful
									</p>
								</div>
							)}
						</div>
						<input
							type="text"
							className="w-full px-6 h-10 text-secondary text-base formInputStyle"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-3 justify-start items-center">
						<div className="w-full flex justify-between items-center">
							<label
								htmlFor="password"
								className="text-base font-medium text-secondary"
							>
								Password
							</label>
						</div>
						<input
							type="password"
							className="w-full px-6 h-10 text-secondary text-base formInputStyle"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2 items-center justify-center ">
						<FormSubmitButton buttonText="Login" isSubmitting={isSubmitting} />
						<Link
							href="/auth/forgot-password"
							className="text-sm font-light text-center text-primary capitalize"
						>
							Forgot Password?
						</Link>
					</div>
					<p className="pt-2 text-sm font-light text-center text-secondary">
						Do not have an account?
						<Link href="/auth/signup" className="text-primary underline px-1">
							Sign Up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
