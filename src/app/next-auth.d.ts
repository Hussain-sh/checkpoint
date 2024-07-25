import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: number;
			role_id: number;
			first_name: string;
			last_name: string;
			profile_picture: string | null;
		} & DefaultSession["user"];
	}
}
