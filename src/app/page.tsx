import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(options);

	// Redirect to the login page if user did not login
	if (!session) {
		redirect("/auth/login");
	}

	redirect("/dashboard");
}
