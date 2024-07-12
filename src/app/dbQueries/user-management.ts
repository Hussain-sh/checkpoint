export const addUserQuery = `
    Insert into users (first_name, last_name, email, password,email_verification_token, created_at, updated_at) values ($1, $2, $3, $4, $5, now(), now())
`;

export const checkEmailAndPasswordQuery = ` 
    SELECT * FROM users WHERE email = $1
`;

export const checkEmailExistsQuery = `
    SELECT 1 FROM users WHERE email = $1;
`;

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

export const getUsersQuery = `
    select users.id, users.first_name, users.last_name, users.profile_picture, users.email, users.is_active, user_roles.role_name
    from users join user_roles on users.role_id = user_roles.id order by users.id asc
`;

export const getUserDetailsQuery = `
    select users.id, users.first_name, users.last_name, users.profile_picture, users.phone_number, users.email, users.date_of_birth, users.is_active, user_roles.role_name
    from users join user_roles on users.role_id = user_roles.id where users.id = $1
`;

export const getUserProfilePictureQuery = `
    select users.profile_picture from users where users.id = $1
`;

export const updateUserDetailsQuery = `
     UPDATE users
            SET
                first_name = $1,
                last_name = $2,
                email = $3,
                role_id = $4,
                date_of_birth = $5,
                phone_number = $6,
                profile_picture = $7,
                is_active = $8
    WHERE id = $9
`;

export const addNewUserQuery = `
    Insert into users
    (first_name, last_name, email, password, date_of_birth, profile_picture, phone_number, is_email_verified, created_at, updated_at)
    values
    ($1, $2, $3, $4, $5, $6, $7, 'true', now(), now())
`;

export const addNewRoleQuery = `
    Insert into user_roles
    (role_name, created_at, updated_at)
    values
    ($1, now(), now())
    RETURNING id
`;
