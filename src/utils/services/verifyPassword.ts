import bcrypt from "bcryptjs";

export const verifyPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return bcrypt.compare(password, hashedPassword);
};