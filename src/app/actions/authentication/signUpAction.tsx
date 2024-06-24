"use server";
import pool from "@/utils/postgres";
import { addUserQuery } from "@/app/dbQueries/user-management";
import { hashPassword } from "@/utils/services/hashPassword";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

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

export async function signUpAction(userData: UserData) {
	const { firstName, lastName, email, password, confirmPassword } = userData;

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
	if (isTextEmpty(password))
		errors.push({ field: "password", message: "Password is required." });

	if (password !== confirmPassword) {
		errors.push({
			field: "confirmPassword",
			message: "Passwords do not match.",
		});
	}

	// store hashed password in db
	const hashedPassword = await hashPassword(password);
	if (errors.length > 0) {
		return {
			success: false,
			errors,
		};
	}

	const client = await pool.connect();
	try {
		await client.query(addUserQuery, [
			firstName,
			lastName,
			email,
			hashedPassword,
		]);
	} catch (error) {
		console.error("Error adding user:", error);
	}

	return {
		success: true,
		message: "User signed up successfully!",
	};
}
