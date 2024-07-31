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
    insert into project_teams (project_id, user_id, lead_id, created_at, updated_at)
    values ($1, $2, (select id from users where first_name = $3), now(), now())
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
    projects.user_id,
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

export const getRecentProjectsQuery = `
    SELECT 
    projects.id, 
    projects.project_name, 
    projects.project_icon, 
    project_priorities.priority_name
FROM 
    projects
JOIN 
    project_priorities 
ON 
    projects.priority_id = project_priorities.id
JOIN 
    users 
ON 
    projects.user_id = users.id
WHERE 
    projects.user_id = $1 
    AND users.role_id = $2 AND projects.is_archived = false
Order By projects.created_at DESC LIMIT 3
`;

export const getRecentTasksQuery = `
    SELECT 
    tasks.id, 
    tasks.task_name, 
    project_stages.stage_name, 
    task_priorities.priority_name
FROM 
    tasks
JOIN 
    task_priorities 
ON 
    tasks.priority_id = task_priorities.id
JOIN 
    project_stages 
ON 
    tasks.stage_id = project_stages.id
JOIN 
    users 
ON 
    tasks.assignee_id = users.id
WHERE 
    tasks.assignee_id = $1 
    AND users.role_id = $2 AND tasks.is_archived = false
Order By tasks.created_at DESC LIMIT 3
`;

export const getRecentProjectsForDeveloperRoleQuery = `
select project_name,project_icon,pp.priority_name from projects as proj
inner join project_teams as pt on proj.user_id=pt.lead_id
join project_priorities as pp on proj.priority_id = pp.id
where pt.user_id=84 and proj.is_archived=false
group by (project_name,project_icon,pp.priority_name)  limit 5;
`;

export const getTasksByProjectIdQuery = `
    select id, task_name, stage_id from tasks where project_id = $1
`;
