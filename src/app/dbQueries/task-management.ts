export const getTaskPrioritiesQuery = `
    select * from task_priorities
`;

export const addTaskQuery = `
   INSERT INTO tasks (
    task_name, 
    task_description, 
    due_date, 
    user_id, 
    priority_id, 
    assignee_id, 
    project_id, 
    created_at, 
    updated_at
)
SELECT 
    $1, 
    $2, 
    $3, 
    u.id, 
    tp.id, 
    $6, 
    p.id, 
    now(), 
    now()
FROM 
    (SELECT id FROM users WHERE first_name = $4) u,
    (SELECT id FROM task_priorities WHERE priority_name = $5) tp,
    (SELECT id FROM projects WHERE id = $7) p;
`;

export const editTaskQuery = `
    Update tasks
    set
    task_name = $2,
    task_description = $3,
    priority_id = (select id from task_priorities where priority_name = $4),
    assignee_id = (select id from users where first_name = $5)
    where id = $1
`;

export const addSubTaskQuery = `
   INSERT INTO sub_tasks (sub_task_name, sub_task_description, task_id, created_at, updated_at)
VALUES ($1, $2, $3, now(), now());
`;

export const changeTaskStatusQuery = `
    Update tasks 
    set 
    stage_id = (select id from project_stages where stage_name = $2)
    where 
    id = $1
`;

export const moveTaskToArchiveQuery = `
    update tasks 
    set
    is_archived = true
    where id = $1
`;

export const getTasksQuery = `
    SELECT 
    t.id,
    t.task_name, 
    ps.stage_name, 
    tp.priority_name,
    t.assignee_id,
    t.priority_id,
    u.first_name,
    u.last_name,
    t.stage_id
FROM 
    tasks t
JOIN 
    project_stages ps ON t.stage_id = ps.id
JOIN 
    task_priorities tp ON t.priority_id = tp.id
JOIN
    users u ON t.assignee_id = u.id
WHERE 
    t.project_id = $1 AND t.is_archived = false
`;

export const getTasksByProjectIdAndAssigneeIdQuery = `
     SELECT 
    t.id,
    t.task_name, 
    ps.stage_name, 
    tp.priority_name,
    t.stage_id
FROM 
    tasks t
JOIN 
    project_stages ps ON t.stage_id = ps.id
JOIN 
    task_priorities tp ON t.priority_id = tp.id
WHERE 
    t.project_id = $1 AND t.assignee_id = $2 AND t.is_archived = false
`;

export const getTaskDetailsQuery = `
    SELECT 
    tasks.id, 
    tasks.project_id,
    tasks.task_name, 
    tasks.task_description, 
    project_stages.stage_name, 
    task_priorities.priority_name, 
    creator.first_name AS creator_first_name, 
    creator.last_name AS creator_last_name, 
    creator.profile_picture AS creator_profile_picture,
    assignee.first_name AS assignee_first_name, 
    assignee.last_name AS assignee_last_name, 
    assignee.profile_picture AS assignee_profile_picture
FROM 
    tasks
JOIN 
    project_stages ON tasks.stage_id = project_stages.id
JOIN 
    task_priorities ON tasks.priority_id = task_priorities.id
JOIN 
    users AS creator ON tasks.user_id = creator.id
JOIN 
    users AS assignee ON tasks.assignee_id = assignee.id
WHERE 
    tasks.id = $1;
`;

export const getSubTasksQuery = `
    select sub_tasks.id, sub_tasks.sub_task_name, sub_tasks.sub_task_description, sub_tasks.task_id from sub_tasks 
    join tasks on sub_tasks.task_id = tasks.id
    where task_id = $1 AND tasks.is_archived = false
`;
