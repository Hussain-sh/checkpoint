"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
type SideBarIconsProps = {
	isProjectsTabAllowed: boolean;
	isUsersTabAllowed: boolean;
	isRolesTabAllowed: boolean;
};
export default function SideBarIcons({
	isProjectsTabAllowed,
	isUsersTabAllowed,
	isRolesTabAllowed,
}: SideBarIconsProps) {
	const pathname = usePathname();
	const urlParts = pathname.split("/");
	const currentLink = pathname.split("/").pop();
	return (
		<div className="flex flex-col gap-8 items-center justify-start py-12">
			<div
				className={`w-full flex justify-start items-start h-auto ${
					currentLink === "dashboard"
						? "border-l-4 border-primary bg-iconColorHover rounded-r-lg"
						: ""
				}  px-4 py-2`}
			>
				<Link
					href="/dashboard"
					className={`text-base flex gap-2 ${
						currentLink === "dashboard" ? "text-activeIconColor" : "text-black"
					}`}
				>
					<svg
						className={`w-6 h-6 ${
							currentLink === "dashboard" ? "activeIconColor" : "iconColor"
						}`}
						viewBox="0 0 28 28"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M5.29634 2.33325H9.23967C10.8847 2.33325 12.203 3.67492 12.203 5.32109V9.29825C12.203 10.9549 10.8847 12.2849 9.23967 12.2849H5.29634C3.66301 12.2849 2.33301 10.9549 2.33301 9.29825V5.32109C2.33301 3.67492 3.66301 2.33325 5.29634 2.33325ZM5.29634 15.7146H9.23967C10.8847 15.7146 12.203 17.0457 12.203 18.7024V22.6796C12.203 24.3246 10.8847 25.6662 9.23967 25.6662H5.29634C3.66301 25.6662 2.33301 24.3246 2.33301 22.6796V18.7024C2.33301 17.0457 3.66301 15.7146 5.29634 15.7146ZM22.7031 2.33325H18.7598C17.1148 2.33325 15.7965 3.67492 15.7965 5.32109V9.29825C15.7965 10.9549 17.1148 12.2849 18.7598 12.2849H22.7031C24.3365 12.2849 25.6665 10.9549 25.6665 9.29825V5.32109C25.6665 3.67492 24.3365 2.33325 22.7031 2.33325ZM18.7598 15.7146H22.7031C24.3365 15.7146 25.6665 17.0457 25.6665 18.7024V22.6796C25.6665 24.3246 24.3365 25.6662 22.7031 25.6662H18.7598C17.1148 25.6662 15.7965 24.3246 15.7965 22.6796V18.7024C15.7965 17.0457 17.1148 15.7146 18.7598 15.7146Z"
						/>
					</svg>
					Dashboard
				</Link>
			</div>
			{isProjectsTabAllowed && (
				<div
					className={`w-full flex justify-start items-start h-auto ${
						urlParts[1].startsWith("project") || urlParts[1].startsWith("task")
							? "border-l-4 border-primary bg-iconColorHover rounded-r-lg"
							: ""
					}  px-4 py-2`}
				>
					<Link
						href="/project-listing"
						className={`text-base flex gap-2 ${
							urlParts[1].startsWith("project") ||
							urlParts[1].startsWith("task")
								? "text-activeIconColor"
								: "text-black"
						}`}
					>
						<svg
							className={`w-6 h-6 ${
								urlParts[1].startsWith("project") ||
								urlParts[1].startsWith("task")
									? "activeIconColor"
									: "iconColor"
							}`}
							viewBox="0 0 19 21"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 2.625V3.9375H18.375V2.625C18.375 1.17715 17.1979 0 15.75 0H2.625C1.17715 0 0 1.17715 0 2.625ZM0 5.25V18.375C0 19.8229 1.17715 21 2.625 21H15.75C17.1979 21 18.375 19.8229 18.375 18.375V5.25H0ZM3.9375 9.1875C3.9375 8.82656 4.23281 8.53125 4.59375 8.53125H13.7812C14.1422 8.53125 14.4375 8.82656 14.4375 9.1875C14.4375 9.54844 14.1422 9.84375 13.7812 9.84375H4.59375C4.23281 9.84375 3.9375 9.54844 3.9375 9.1875ZM3.9375 13.125C3.9375 12.7641 4.23281 12.4688 4.59375 12.4688H13.7812C14.1422 12.4688 14.4375 12.7641 14.4375 13.125C14.4375 13.4859 14.1422 13.7812 13.7812 13.7812H4.59375C4.23281 13.7812 3.9375 13.4859 3.9375 13.125ZM3.9375 17.0625C3.9375 16.7016 4.23281 16.4062 4.59375 16.4062H8.53125C8.89219 16.4062 9.1875 16.7016 9.1875 17.0625C9.1875 17.4234 8.89219 17.7188 8.53125 17.7188H4.59375C4.23281 17.7188 3.9375 17.4234 3.9375 17.0625Z" />
						</svg>
						Projects
					</Link>
				</div>
			)}
			{isUsersTabAllowed && (
				<div
					className={`w-full flex justify-start items-start h-auto ${
						urlParts[1].startsWith("user")
							? "border-l-4 border-primary bg-iconColorHover rounded-r-lg"
							: ""
					}  px-4 py-2`}
				>
					<Link
						href="/user-listing"
						className={`text-base flex gap-2 ${
							urlParts[1].startsWith("user")
								? "text-activeIconColor"
								: "text-black"
						}`}
					>
						<svg
							className={`w-6 h-6 ${
								urlParts[1].startsWith("user") ? "activeIconColor" : "iconColor"
							}`}
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M16.5808 9.05615C16.5808 12.1405 14.0568 14.6123 10.9072 14.6123C7.75882 14.6123 5.2337 12.1405 5.2337 9.05615C5.2337 5.97176 7.75882 3.5 10.9072 3.5C14.0568 3.5 16.5808 5.97176 16.5808 9.05615ZM2.33301 20.9036C2.33301 18.0484 6.28279 17.334 10.9072 17.334C15.5568 17.334 19.4815 18.073 19.4815 20.9304C19.4815 23.7856 15.5317 24.5 10.9072 24.5C6.25767 24.5 2.33301 23.761 2.33301 20.9036ZM18.8687 9.15687C18.8687 10.7276 18.3869 12.1932 17.5422 13.4106C17.4543 13.5358 17.5319 13.7046 17.6849 13.7315C17.8972 13.7661 18.1152 13.7874 18.3378 13.7918C20.5525 13.8489 22.5399 12.4526 23.089 10.3497C23.9029 7.22955 21.5148 4.428 18.4725 4.428C18.1426 4.428 17.8264 4.46154 17.5182 4.52302C17.476 4.53197 17.4303 4.55209 17.4075 4.58786C17.3778 4.6337 17.3995 4.69295 17.4292 4.73208C18.3435 5.98752 18.8687 7.51574 18.8687 9.15687ZM22.5365 15.986C24.0251 16.2711 25.0034 16.8513 25.4086 17.6976C25.7522 18.3907 25.7522 19.1956 25.4086 19.8887C24.7888 21.199 22.7888 21.6204 22.0114 21.7289C21.8504 21.7512 21.7214 21.6171 21.7385 21.4583C22.1358 17.8273 18.9771 16.1056 18.1598 15.7099C18.1255 15.6909 18.1175 15.664 18.1209 15.6462C18.1232 15.635 18.1381 15.6171 18.1643 15.6137C19.9326 15.5802 21.8344 15.8183 22.5365 15.986Z"
							/>
						</svg>
						All Employees
					</Link>
				</div>
			)}
			{isRolesTabAllowed && (
				<div
					className={`w-full flex justify-start items-start h-auto ${
						urlParts[1].includes("role")
							? "border-l-4 border-primary bg-iconColorHover rounded-r-lg"
							: ""
					}  px-4 py-2`}
				>
					<Link
						href="/manage-roles"
						className={`text-base flex gap-2 ${
							urlParts[1].includes("role")
								? "text-activeIconColor"
								: "text-black"
						}`}
					>
						<svg
							className={`w-6 h-6 ${
								urlParts[1].includes("role") ? "activeIconColor" : "iconColor"
							}`}
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M13.6825 25.5659C13.8117 25.6334 13.9561 25.6677 14.1006 25.6665C14.2451 25.6654 14.3883 25.6299 14.5187 25.5613L18.6812 23.3361C19.8616 22.7069 20.786 22.0033 21.5072 21.1842C23.0752 19.3995 23.9314 17.1217 23.9161 14.773L23.8668 7.02556C23.8621 6.13321 23.276 5.33696 22.4092 5.04752L14.6655 2.44941C14.1992 2.29153 13.6883 2.29496 13.2303 2.45742L5.51596 5.1482C4.65386 5.44908 4.07834 6.25105 4.08304 7.14454L4.13237 14.8863C4.14764 17.2384 5.03323 19.5059 6.62706 21.2723C7.35527 22.08 8.28785 22.7733 9.48117 23.3922L13.6825 25.5659ZM12.5805 16.4603C12.7543 16.6274 12.9799 16.7097 13.2054 16.7074C13.4309 16.7063 13.6552 16.6216 13.8267 16.4523L18.3756 11.9677C18.7174 11.6302 18.7139 11.0879 18.3686 10.755C18.0221 10.4221 17.4642 10.4244 17.1224 10.7619L13.1924 14.6356L11.5833 13.0889C11.2369 12.7559 10.6801 12.7594 10.3372 13.0969C9.99538 13.4344 9.9989 13.9766 10.3454 14.3095L12.5805 16.4603Z"
							/>
						</svg>
						Roles and Permissions
					</Link>
				</div>
			)}
		</div>
	);
}
