"use server";
import { saveProfileDetailsQuery } from "@/app/dbQueries/profile-management";
import pool from "@/utils/postgres";
import fs from "node:fs";

export default async function saveProfile(formData: FormData) {
	const profile = {
		firstName: formData.get("firstName") as string,
		lastName: formData.get("lastName") as string,
		email: formData.get("email") as string,
		dateOfBirth: formData.get("dob") as string,
		phoneNumber: formData.get("phone") as string,
		image: formData.get("image") as File,
	};

	const extension = profile.image.name.split(".").pop();

	const fileName = `${profile.firstName}.${extension}`;

	const stream = fs.createWriteStream(
		`public/images/profilepictures/${fileName}`
	);

	const bufferedImage = await profile.image.arrayBuffer();

	stream.write(Buffer.from(bufferedImage), (error) => {
		if (error) {
			throw new Error("Saving Image failed!");
		}
	});

	const imagePath = `/images/profilepictures/${fileName}`;

	const { firstName, lastName, email, dateOfBirth, phoneNumber } = profile;

	const client = await pool.connect();
	try {
		await client.query(saveProfileDetailsQuery, [
			firstName,
			lastName,
			email,
			dateOfBirth,
			imagePath,
			phoneNumber,
		]);
	} catch (error) {
		console.error("Erro saving profile", error);
	} finally {
		client.release();
	}
}
