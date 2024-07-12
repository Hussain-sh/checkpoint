"use server";
import { getRoleIdByRoleNameQuery } from "@/app/dbQueries/role-management";
import {
	getUserProfilePictureQuery,
	updateUserDetailsQuery,
} from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";
import fs from "node:fs";

function isTextEmpty(text: string) {
	return !text || text.trim() === "";
}

function hasNumbers(text: string): boolean {
	const numberPattern = /\d/;
	return numberPattern.test(text);
}

function isValidEmail(email: string): boolean {
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailPattern.test(email);
}

interface FormState {
	message: string;
	success: boolean;
}
export default async function editUserDetails(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	const user = {
		firstName: formData.get("firstName") as string,
		lastName: formData.get("lastName") as string,
		email: formData.get("email") as string,
		role: formData.get("role") as string,
		dateOfBirth: formData.get("dob") as string,
		phoneNumber: formData.get("phone") as string,
		image: formData.get("image") as File,
		status: formData.get("isActive") as string,
		userId: formData.get("id") as string,
	};
	const {
		firstName,
		lastName,
		email,
		role,
		dateOfBirth,
		phoneNumber,
		image,
		status,
		userId,
	} = user;

	// form validations
	if (
		isTextEmpty(firstName) ||
		hasNumbers(firstName) ||
		isTextEmpty(lastName) ||
		hasNumbers(lastName) ||
		isTextEmpty(email) ||
		!isValidEmail(email)
	) {
		return {
			message: "Please provide correct details",
			success: false,
		};
	}

	let imagePath;

	const client = await pool.connect();
	if (user.image.size !== 0) {
		const extension = image.name.split(".").pop();
		const fileName = `${firstName}-${Date.now()}.${extension}`;
		const stream = fs.createWriteStream(
			`public/images/profilepictures/${fileName}`
		);

		const bufferedImage = await image.arrayBuffer();

		stream.write(Buffer.from(bufferedImage), (error) => {
			if (error) {
				throw new Error("Saving Image failed!");
			}
		});

		imagePath = `/images/profilepictures/${fileName}`;
	} else {
		const result = await client.query(getUserProfilePictureQuery, [userId]);
		imagePath = result.rows[0].profile_picture;
	}

	const formattedDateOfBirth = user.dateOfBirth ? new Date(dateOfBirth) : null;

	try {
		const getRoleId = await client.query(getRoleIdByRoleNameQuery, [role]);
		const roleId = getRoleId.rows[0].id;

		await client.query(updateUserDetailsQuery, [
			firstName,
			lastName,
			email,
			roleId,
			formattedDateOfBirth,
			phoneNumber,
			imagePath,
			status,
			userId,
		]);

		return {
			message: "User updated successfully!",
			success: true,
		};
	} catch (error) {
		console.error("Error updating user details", error);
		return {
			message: "Error updating user details",
			success: false,
		};
	} finally {
		client.release();
	}
}
