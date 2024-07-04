export const getRolesQuery = `
    select role_name from user_roles
`;

export const getPermissionsQuery = `
    select * from user_permissions
`;

export const getRoleIdByRoleNameQuery = `
    select id from user_roles where role_name = $1
`;

export const getPermissionIdFromPermissionNameQuery = `
    select id from user_permissions where permission_name = $1
`;

export const addPermissionsQuery = `
    insert into roles_permissions (role_id, permission_id, created_at, updated_at) values ($1,$2, now(), now())
`;

export const getSelectedRolePermissionsQuery = `
    SELECT user_permissions.permission_name
    FROM user_permissions
    JOIN roles_permissions ON roles_permissions.permission_id = user_permissions.id
    WHERE roles_permissions.role_id = $1
`;
