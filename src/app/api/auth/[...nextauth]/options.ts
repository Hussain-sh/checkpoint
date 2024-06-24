import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginAction } from "@/app/actions/authentication/loginAction";

export const options: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials): Promise<any> {
				const { email, password } = credentials as {
					email: string;
					password: string;
				};

				const response = await loginAction(email, password);

				if (!response.success) {
					throw new Error(response.errors[0].field);
				}

				return response.user;
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			return { ...token, ...user };
		},
		session: async ({ session, token }) => {
			session.user = token as any;
			return session;
		},
	},
};
