"use server";
import { saveProfileDetailsQuery } from "@/app/dbQueries/profile-management";
import {
	addNewUserQuery,
	checkEmailExistsQuery,
	getUserProfilePictureQuery,
} from "@/app/dbQueries/user-management";
import pool from "@/utils/postgres";
import { hashPassword } from "@/utils/services/hashPassword";
import { sendEmailWithUserCredentials } from "@/utils/services/sendEmail";
import fs from "node:fs";
import auditLogAction from "../auditLogAction";
import getProfileDetails from "./getProfileDetailsAction";

interface ErrorMsg {
	field: string;
	message: string;
}

interface NewProfileTypes {
	first_name: string;
	last_name: string;
	email: string;
	date_of_birth: string | null;
	phone_number: string;
	profile_picture: File;
}

type UpdatedField = {
	field: string;
	newValue: any;
};

interface FormState {
	message: string;
	success: boolean;
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

export default async function saveProfile(
	prevState: FormState,
	formData: FormData
) {
	const profile = {
		firstName: formData.get("firstName") as string,
		lastName: formData.get("lastName") as string,
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		confirmPassword: formData.get("confirm_password") as string,
		dateOfBirth: formData.get("dob") as string,
		phoneNumber: formData.get("phone") as string,
		image: formData.get("image") as File,
		userId: formData.get("id") as string,
		adminEmail: formData.get("adminEmail") as string, // for audit logs
	};

	const {
		firstName,
		lastName,
		email,
		dateOfBirth,
		phoneNumber,
		password,
		confirmPassword,
		userId,
		adminEmail,
	} = profile;

	let imagePath;
	const client = await pool.connect();

	if (profile.image.size !== 0) {
		const extension = profile.image.name.split(".").pop();

		const fileName = `${profile.firstName}-${Date.now()}.${extension}`;
		const stream = fs.createWriteStream(
			`public/images/profilepictures/${fileName}`
		);

		const bufferedImage = await profile.image.arrayBuffer();

		stream.write(Buffer.from(bufferedImage), (error) => {
			if (error) {
				throw new Error("Saving Image failed!");
			}
		});

		imagePath = `/images/profilepictures/${fileName}`;
	} else {
		// if image not picked
		const result = await client.query(getUserProfilePictureQuery, [userId]);
		imagePath = result.rows[0].profile_picture;
	}

	const currentProfile = await getProfileDetails(userId); // get profile details to compare with the updated details for audit logs
	const formattedDateOfBirthCurrentProfile = currentProfile.date_of_birth
		? new Date(currentProfile.date_of_birth).toLocaleDateString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
		  })
		: null;
	const formattedDateOfBirth = profile.dateOfBirth
		? new Date(dateOfBirth)
		: null;
	const newProfile: NewProfileTypes = {
		// updated details object
		first_name: firstName,
		last_name: lastName,
		email: email,
		date_of_birth: formattedDateOfBirthCurrentProfile,
		phone_number: phoneNumber,
		profile_picture: imagePath,
	};
	const updatedFields = getUpdatedFields(newProfile, currentProfile);
	const updatedFieldsString = updatedFields
		.map((field) => `${field.field}: ${field.newValue}`)
		.join(", ");

	const auditLogData = {
		logType: "info",
		feature: "Profile Management",
		action: `User with email ${email} updated profile information. Updated fields: Updated fields: ${updatedFieldsString}`,
		userId: userId,
	};
	await auditLogAction(auditLogData);

	const errors: ErrorMsg[] = [];
	// Validation for all fields
	if (isTextEmpty(firstName))
		errors.push({ field: "firstName", message: "First name is required." });
	else if (hasNumbers(firstName))
		errors.push({
			field: "firstName",
			message: "First name cannot contain numbers.",
		});
	if (isTextEmpty(lastName))
		errors.push({ field: "lastName", message: "Last name is required." });
	else if (hasNumbers(lastName))
		errors.push({
			field: "lastName",
			message: "Last name cannot contain numbers.",
		});
	if (isTextEmpty(email) || !isValidEmail(email)) {
		errors.push({
			field: "email",
			message: isTextEmpty(email)
				? "Email is required."
				: "Invalid email address.",
		});
	}

	//return validation errors for edit profile
	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	try {
		if (password) {
			if (isTextEmpty(password))
				errors.push({ field: "password", message: "Password is required." });

			if (password !== confirmPassword) {
				errors.push({
					field: "confirmPassword",
					message: "Passwords do not match.",
				});
			}

			const emailCheckResult = await client.query(checkEmailExistsQuery, [
				email,
			]);

			if (emailCheckResult.rows.length > 0) {
				errors.push({
					field: "email",
					message: "Email already exists.",
				});
			}
			//return validation errors for add User
			if (errors.length > 0) {
				return {
					success: false,
					errors,
				};
			}

			const auditLogData = {
				logType: "info",
				feature: "User Management",
				action: `User with email ${adminEmail} added a new user with email ${email}`,
				userId: userId,
			};
			await auditLogAction(auditLogData);
			// store hashed password in db
			const hashedPassword = await hashPassword(password);

			await client.query(addNewUserQuery, [
				firstName,
				lastName,
				email,
				hashedPassword,
				formattedDateOfBirth,
				imagePath,
				phoneNumber,
			]);

			await sendEmailWithUserCredentials(firstName, email, password); // send email with credentials
		} else {
			await client.query(saveProfileDetailsQuery, [
				firstName,
				lastName,
				email,
				formattedDateOfBirth,
				imagePath,
				phoneNumber,
			]);
		}

		return {
			errors: [],
			success: true,
			noErrors: false,
		};
	} catch (error) {
		console.error("Erro saving profile", error);
	} finally {
		client.release();
	}
}
