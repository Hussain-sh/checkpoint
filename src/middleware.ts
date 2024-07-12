import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
	async (req) => {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		// Pages that require admin access
		const adminPages = ["/user-listing", "/manage-roles"];

		// Check if the requested page requires admin access
		if (adminPages.includes(new URL(req.url).pathname)) {
			// If there's no token or the user is not an admin, redirect to the unauthorized page
			if (!token || token.role_id !== 1) {
				return NextResponse.redirect(new URL("/unauthorized", req.url));
			}
		}

		// Allow access if the user is an admin or the page doesn't require admin access
		return NextResponse.next();
	},
	{
		pages: {
			signIn: "/auth/login",
		},
	}
);

export const config = {
	matcher: ["/", "/dashboard", "/user-listing", "/manage-roles"],
};
