import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import NavBarDropdown from "./NavbarDropdown";

interface User {
	first_name?: string | null;
	last_name?: string | null;
	name?: string | null;
	email?: string | null;
	image?: string | null;
}

interface Session {
	user?: User;
}
export default async function NavBar() {
	const session: Session | null = await getServerSession(options);
	const firstName = session?.user?.first_name;
	const lastName = session?.user?.last_name;

	const fullName = firstName + " " + lastName;
	return (
		<nav className="flex justify-around items-center h-20 bg-primary text-white">
			<div>
				<Link href="/" className="text-xl font-bold">
					Checkpoint
				</Link>
			</div>
			<div className="flex gap-2">
				<NavBarDropdown fullName={fullName} />
			</div>
		</nav>
	);
}
