export const addUserQuery = `
    insert into users (first_name, last_name, email, password, created_at, updated_at) values ($1, $2, $3, $4, now(), now())
`;

export const checkEmailAndPasswordQuery =
	"SELECT * FROM users WHERE email = $1";
