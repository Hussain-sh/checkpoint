"use server";
import { getRoleIdByRoleNameQuery } from "@/app/dbQueries/role-management";
import {
	checkEmailExistsOnEditUserQuery,
	checkEmailExistsQuery,
	getUserProfilePictureQuery,
	updateUserDetailsQuery,
} from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";
import fs from "node:fs";
import auditLogAction from "../auditLogAction";
import getUserDetails from "./getUserDetailsByIdAction";

interface FormState {
	message: string;
	success: boolean;
	errors: ErrorMsg[];
}

interface NewProfileTypes {
	first_name: string;
	last_name: string;
	profile_picture: string;
	phone_number: string;
	email: string;
	date_of_birth: string | null;
	is_active: boolean;
	role_name: string;
}

type UpdatedField = {
	field: string;
	newValue: any;
};

interface ErrorMsg {
	field: string;
	message: string;
}

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

// get updated field for audit log
function getUpdatedFields(
	newProfile: NewProfileTypes,
	currentProfile: NewProfileTypes
): UpdatedField[] {
	const updatedFields: UpdatedField[] = [];

	for (const key in newProfile) {
		if (
			newProfile[key as keyof NewProfileTypes] !==
			currentProfile[key as keyof NewProfileTypes]
		) {
			updatedFields.push({
				field: key,
				newValue: newProfile[key as keyof NewProfileTypes],
			});
		}
	}

	return updatedFields;
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
		status: formData.get("isActive") === "true",
		userId: formData.get("id") as string,
		adminEmail: formData.get("adminEmail") as string,
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
		adminEmail,
	} = user;

	const errors: ErrorMsg[] = [];
	// form validations
	if (
		isTextEmpty(firstName) ||
		hasNumbers(firstName) ||
		isTextEmpty(lastName) ||
		hasNumbers(lastName) ||
		isTextEmpty(email) ||
		!isValidEmail(email)
	) {
		errors.push({
			field: "otherFields",
			message: "Please give correct information",
		});
	}

	if (errors.length > 0) {
		return {
			success: false,
			message: "",
			errors,
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

	const currentProfile = await getUserDetails(userId); // get user details to compare with the updated details
	const currentEmail = currentProfile.email; // check if email exists but current profile email is allowed
	const newProfile: NewProfileTypes = {
		first_name: firstName,
		last_name: lastName,
		profile_picture: imagePath,
		phone_number: phoneNumber,
		email: email,
		date_of_birth: dateOfBirth,
		is_active: status,
		role_name: role,
	};

	const updatedFields = getUpdatedFields(newProfile, currentProfile); // compare and get the updated fields
	const updatedFieldsString = updatedFields
		.map((field) => `${field.field}: ${field.newValue}`)
		.join(", ");
	const formattedDateOfBirth = user.dateOfBirth ? new Date(dateOfBirth) : null;

	try {
		const getRoleId = await client.query(getRoleIdByRoleNameQuery, [role]);
		const roleId = getRoleId.rows[0].id;
		// check if user has entered any other email which exists in the database
		const emailCheckResult = await client.query(
			checkEmailExistsOnEditUserQuery,
			[email, currentEmail]
		);

		if (emailCheckResult.rows.length > 0) {
			errors.push({
				field: "email",
				message: "Email already exists.",
			});
		}

		if (errors.length > 0) {
			return {
				success: false,
				message: "",
				errors,
			};
		}
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
		const auditLogData = {
			logType: "info",
			feature: "User Management",
			action: `User with email: ${adminEmail} updated details of user with email: ${email}. Updated fields: ${updatedFieldsString}`,
			userId: userId,
		};
		await auditLogAction(auditLogData);
		return {
			message: "User updated successfully!",
			success: true,
			errors: [],
		};
	} catch (error) {
		console.error("Error updating user details", error);
		return {
			message: "Error updating user details",
			success: true,
			errors: [],
		};
	} finally {
		client.release();
	}
}
