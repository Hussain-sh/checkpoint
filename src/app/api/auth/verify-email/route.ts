import pool from "@/utils/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const token = req.nextUrl.searchParams.get("token");

	if (!token) {
		return NextResponse.json({ message: "Token is required" }, { status: 400 });
	}

	const client = await pool.connect();
	try {
		const result = await client.query(
			"UPDATE users SET is_email_verified = true WHERE email_verification_token = $1 RETURNING *",
			[token]
		);

		if (result.rowCount === 0) {
			return NextResponse.json({ message: "Invalid token" }, { status: 400 });
		}

		return NextResponse.json(
			{ message: "Verification successful" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error verifying email:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	} finally {
		client.release();
	}
}
