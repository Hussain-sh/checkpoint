export const saveProfileDetailsQuery = `
  UPDATE users
  SET
    first_name = $1,
    last_name = $2,
    email = $3,
    date_of_birth = $4,
    profile_picture = $5,
    phone_number = $6,
    updated_at = now()
  WHERE email = $3;
`;

export const getProfileDetailsQuery = `
    select 
    users.first_name, users.last_name, users.email, users.date_of_birth, users.phone_number, users.profile_picture, user_roles.role_name
    from users
    join 
    user_roles on users.role_id = user_roles.id
    where users.id = $1
`;
