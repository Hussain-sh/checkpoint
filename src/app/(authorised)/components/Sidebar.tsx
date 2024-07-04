import { getServerSession } from "next-auth";
import Link from "next/link";
import { options } from "../../api/auth/[...nextauth]/options";
import Image from "next/image";
import logo from "../../../assets/images/logo.png";
import { usePathname } from "next/navigation";
import SideBarIcons from "./SidebarIcons";

export default async function Sidebar() {
	const roleLinks: { [key: number]: string[] } = {
		1: ["H", "U", "R"],
		2: ["H", "P"],
		3: ["H", "P"],
	};
	const session = await getServerSession(options);
	const user = session?.user as { role_id?: number } | undefined;
	const roleId = user?.role_id;
	const links = roleId ? roleLinks[roleId] : [];
	return (
		<div className="w-20 bg-white h-screen">
			<div className="flex justify-center items-center h-20 w-full">
				<Link href="/">
					<Image src={logo} alt="logo" className="w-14 h-14" />
				</Link>
			</div>
			<SideBarIcons links={links} />
		</div>
	);
}
