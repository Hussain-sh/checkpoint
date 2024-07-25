export const getProjectPrioritiesQuery = `
    select * from project_priorities
`;

export const getUsersByRoleQuery = `
    select users.id, users.first_name, users.last_name, users.profile_picture from 
    users join user_roles on users.role_id = user_roles.id 
    where users.role_id = $1
`;

export const getUsersWithViewProjectPermissionsQuery = `
    select 
    users.id, 
    users.first_name, 
    users.last_name, 
    users.profile_picture 
from 
    users 
where 
    users.role_id IN (select role_id from roles_permissions where permission_id = 7);
`;

export const addProjectQuery = `
    insert into projects (project_name, priority_id, user_id, project_description, project_icon, created_at, updated_at)
    values ($1, (select id from project_priorities where priority_name = $2), (select id from users where first_name = $3), $4, $5, now(), now())
    RETURNING id
`;

export const addProjectTeamQuery = `
    insert into project_teams (project_id, user_id, created_at, updated_at)
    values ($1, $2, now(), now())
`;

export const getProjectsQuery = `
    select projects.id, projects.project_name,projects.is_archived, users.first_name, users.last_name, users.profile_picture,project_priorities.priority_name
    from projects 
    join
    users on projects.user_id = users.id 
    join 
    project_priorities ON projects.priority_id = project_priorities.id
    where is_archived = false
`;

export const getArchivedProjectsQuery = `
    select projects.id, projects.project_name,projects.is_archived, users.first_name, users.last_name, users.profile_picture,project_priorities.priority_name
    from projects 
    join
    users on projects.user_id = users.id 
    join 
    project_priorities ON projects.priority_id = project_priorities.id
    where is_archived = true
`;

export const getUsersByProjectQuery = `
    select users.id, users.first_name, users.last_name, users.profile_picture from 
    users join project_teams on users.id = project_teams.user_id 
    where project_teams.project_id = $1
`;

export const getProjectDetailsQuery = `
    select 
    projects.id, 
    projects.project_name, 
    users.first_name, 
    users.last_name, 
    users.profile_picture, 
    projects.project_description, 
    projects.project_icon, 
    project_priorities.priority_name
from 
    projects 
join 
    users ON projects.user_id = users.id 
join 
    project_priorities ON projects.priority_id = project_priorities.id 
where 
    projects.id = $1;
`;

export const getTeamMembersFromProjectIdQuery = `
        select users.id, users.first_name, users.last_name, users.profile_picture
    from users 
    join 
    project_teams on users.id = project_teams.user_id 
    where project_teams.project_id = $1
`;

export const editProjectQuery = `
    UPDATE projects
SET 
    project_name = $2,
    priority_id = (SELECT id FROM project_priorities WHERE priority_name = $3),
    user_id = (SELECT id FROM users WHERE first_name = $4),
    project_description = $5,
    project_icon = $6,
    updated_at = NOW()
WHERE id = $1
RETURNING id;
`;

export const deleteProjectTeambyProjectIdQuery = `
    Delete from project_teams where project_id = $1
`;

export const deleteProjectQuery = `
    Update projects
    set
    is_archived = true
    where id = $1
`;

export const getProjectStagesQuery = `
    select id, stage_name from project_stages
`;
