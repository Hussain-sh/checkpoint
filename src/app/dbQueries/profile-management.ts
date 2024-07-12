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
    first_name, last_name, email, date_of_birth, phone_number, profile_picture
    from users
    where id = $1
`;
