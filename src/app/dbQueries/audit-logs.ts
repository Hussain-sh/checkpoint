export const addAuditLogQuery = `
    Insert into audit_logs (log_type, feature, action, user_id, created_at) values ($1, $2, $3, $4, now())
`;
