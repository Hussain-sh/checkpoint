export const addUserQuery = `
    insert into users (first_name, last_name, email, password,email_verification_token, created_at, updated_at) values ($1, $2, $3, $4, $5, now(), now())
`;

export const checkEmailAndPasswordQuery =
	"SELECT * FROM users WHERE email = $1";

export const saveForgotPasswordToken = `
    UPDATE users 
    SET forgot_password_token = $1 
    WHERE email = $2
`;

export const updatePasswordQuery = `
    UPDATE users 
    SET password = $1 
    WHERE forgot_password_token = $2
`;
