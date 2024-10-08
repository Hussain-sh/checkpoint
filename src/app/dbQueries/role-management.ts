export const getRolesQuery = `
    select id, role_name from user_roles
`;

export const getPermissionsQuery = `
    select * from user_permissions
`;

export const getRoleIdByRoleNameQuery = `
    select id from user_roles where role_name = $1
`;

export const getRoleNameByRoleIdQuery = `
    select role_name from user_roles where id = $1
`;

export const getPermissionIdFromPermissionNameQuery = `
    select id from user_permissions where permission_name = $1
`;

export const addPermissionsQuery = `
    insert into roles_permissions (role_id, permission_id, created_at, updated_at) values ($1,$2, now(), now())
`;

export const getSelectedRolePermissionsQuery = `
    SELECT user_permissions.permission_name, user_permissions.permission_slug
    FROM user_permissions
    JOIN roles_permissions ON roles_permissions.permission_id = user_permissions.id
    WHERE roles_permissions.role_id = $1
`;

export const updateRoleQuery = `
    Update user_roles 
    set role_name = $1, updated_at = now()
    where id = $2
`;

export const deletePermissionsQuery = `
    Delete from roles_permissions where role_id = $1
`;
