import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import NavBarDropdown from "./NavbarDropdown";
import CurrentDate from "./CurrentDate";
import defaultAvatar from "../../../../public/images/profilepictures/avatar.png";
import Image from "next/image";

interface User {
	first_name?: string | null;
	last_name?: string | null;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	profile_picture?: string | null;
}

interface Session {
	user?: User;
}
export default async function NavBar() {
	const session: Session | null = await getServerSession(options);
	const firstName = session?.user?.first_name;
	const lastName = session?.user?.last_name;
	const email = session?.user?.email ?? "";
	const profilePicture = session?.user?.profile_picture;

	const fullName = firstName + " " + lastName;
	return (
		<nav className="w-full flex justify-between items-center h-20 bg-white text-black px-5">
			<div className="flex flex-col gap-1 h-14 px-4">
				<h1 className="font-bold text-base">Welcome, {firstName}!</h1>
				<div className="flex gap-2 justify-start items-center">
					<svg
						className="w-4 h-4"
						viewBox="0 0 25 25"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M17.0947 2.88389L17.0957 3.66475C19.9651 3.88964 21.8606 5.84491 21.8637 8.84341L21.875 17.6203C21.8791 20.8895 19.8252 22.901 16.5331 22.9062L8.49155 22.9166C5.21999 22.9207 3.14043 20.8613 3.13632 17.5828L3.12501 8.909C3.12089 5.89072 4.94951 3.94066 7.81893 3.67725L7.8179 2.89639C7.81687 2.43828 8.15627 2.09367 8.60879 2.09367C9.06132 2.09262 9.40071 2.4362 9.40174 2.89431L9.40277 3.62311L15.5119 3.61478L15.5108 2.88598C15.5098 2.42787 15.8492 2.0843 16.3017 2.08325C16.744 2.08221 17.0936 2.42579 17.0947 2.88389ZM4.70987 9.23072L20.2809 9.20989V8.84549C20.2366 6.60703 19.1135 5.43262 17.0978 5.25771L17.0988 6.05939C17.0988 6.50708 16.7501 6.86211 16.3079 6.86211C15.8554 6.86315 15.5149 6.50916 15.5149 6.06147L15.5139 5.21814L9.40482 5.22647L9.40585 6.06876C9.40585 6.51749 9.06749 6.87148 8.61496 6.87148C8.16244 6.87252 7.82201 6.51957 7.82201 6.07084L7.82099 5.26916C5.81548 5.4701 4.70576 6.64868 4.70885 8.90692L4.70987 9.23072ZM15.8749 13.9627V13.9742C15.8852 14.4531 16.276 14.8165 16.7501 14.806C17.2129 14.7946 17.5822 14.3979 17.5719 13.919C17.5503 13.4609 17.179 13.0871 16.7172 13.0882C16.2441 13.0986 15.8739 13.4838 15.8749 13.9627ZM16.7244 18.6375C16.2513 18.6271 15.8698 18.2325 15.8687 17.7535C15.8584 17.2746 16.238 16.8779 16.711 16.8665H16.7213C17.2047 16.8665 17.5966 17.2611 17.5966 17.7504C17.5976 18.2397 17.2068 18.6364 16.7244 18.6375ZM11.6376 13.9794C11.6582 14.4583 12.05 14.8321 12.5231 14.8113C12.9859 14.7894 13.3552 14.3938 13.3346 13.9148C13.3233 13.4463 12.9427 13.0819 12.4799 13.083C12.0068 13.1038 11.6366 13.5005 11.6376 13.9794ZM12.5272 18.5906C12.0542 18.6114 11.6633 18.2377 11.6417 17.7587C11.6417 17.2798 12.011 16.8842 12.4841 16.8623C12.9469 16.8613 13.3284 17.2257 13.3387 17.6931C13.3603 18.1731 12.9901 18.5688 12.5272 18.5906ZM7.40034 14.0158C7.42091 14.4947 7.81276 14.8696 8.28585 14.8477C8.74866 14.8269 9.11788 14.4302 9.09628 13.9513C9.086 13.4828 8.70547 13.1184 8.24163 13.1194C7.76853 13.1402 7.39931 13.5369 7.40034 14.0158ZM8.28997 18.5958C7.81687 18.6177 7.42605 18.2429 7.40446 17.7639C7.40343 17.285 7.77368 16.8883 8.24677 16.8675C8.70958 16.8665 9.09114 17.2309 9.10143 17.6994C9.12302 18.1783 8.7538 18.575 8.28997 18.5958Z"
							fill="#4189F6"
						/>
					</svg>
					<CurrentDate />
				</div>
			</div>
			<div className="flex gap-2 h-14">
				<div className="w-12 h-12 rounded-full border border-black overflow-hidden flex items-center justify-center">
					{profilePicture != null ? (
						<Image
							src={profilePicture}
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
				<NavBarDropdown fullName={fullName} email={email} />
			</div>
		</nav>
	);
}
