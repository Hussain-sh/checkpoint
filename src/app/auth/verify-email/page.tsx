"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmail() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		if (token) {
			fetch(`/api/auth/verify-email?token=${token}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.message === "Verification successful") {
						router.push("/auth/login");
					} else {
						console.error("Verification failed", data);
						router.push("/auth/login?error=verification_failed");
					}
				})
				.catch((error) => {
					console.error("Error verifying email:", error);
					router.push("/auth/login?error=verification_failed");
				});
		}
	}, [token, router]);

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
						Verify Email
					</h1>
					<p className="text-sm text-center font-thin">
						A link has been sent to your email address, please click on the link
						to verify your email.
					</p>
				</div>
			</div>
		</div>
	);
}
