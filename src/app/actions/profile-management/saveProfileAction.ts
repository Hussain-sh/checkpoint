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

interface ErrorMsg {
	field: string;
	message: string;
}

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
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

interface FormState {
	message: string;
	success: boolean;
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
	const formattedDateOfBirth = profile.dateOfBirth
		? new Date(dateOfBirth)
		: null;

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
		};
	} catch (error) {
		console.error("Erro saving profile", error);
	} finally {
		client.release();
	}
}
