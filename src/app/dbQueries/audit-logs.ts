export const addAuditLogQuery = `
    Insert into audit_logs (log_type, feature, action, user_id, created_at) values ($1, $2, $3, $4, now())
`;

export const getAuditLogsQuery = `
    SELECT * FROM public.audit_logs
    ORDER BY id DESC limit 30; 
`;
