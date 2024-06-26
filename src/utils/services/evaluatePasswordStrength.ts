export function evaluatePasswordStrength(password: string) {
	let score = 0;
	if (!password) return { strength: "", score: 0 };

	// Check password length
	if (password.length > 8) score += 1;
	// Contains lowercase
	if (/[a-z]/.test(password)) score += 1;
	// Contains uppercase
	if (/[A-Z]/.test(password)) score += 1;
	// Contains numbers
	if (/\d/.test(password)) score += 1;
	// Contains special characters
	if (/[^A-Za-z0-9]/.test(password)) score += 1;

	let strength = "";
	switch (score) {
		case 0:
		case 1:
		case 2:
			strength = "Weak";
			break;
		case 3:
			strength = "Medium";
			break;
		case 4:
		case 5:
			strength = "Strong";
			break;
	}

	return { strength };
}
