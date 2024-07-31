"use server";
import pool from "@/utils/postgres";
import { addAuditLogQuery, getAuditLogsQuery } from "../dbQueries/audit-logs";

interface AuditLogData {
	logType: string;
	feature: string;
	action: string;
	userId: number | null | string;
}
export default async function auditLogAction(auditLogData: AuditLogData) {
	const { logType, feature, action, userId } = auditLogData;
	const client = await pool.connect();
	try {
		await client.query(addAuditLogQuery, [logType, feature, action, userId]);
	} catch (error) {
		console.error("Error logging audit trail", error);
	} finally {
		client.release();
	}
}

export async function getAuditLogs() {
	const client = await pool.connect();
	try {
		const result = await client.query(getAuditLogsQuery);
		const auditLogsData = result.rows;
		return auditLogsData;
	} catch (error) {
		console.error("Error fetching audit logs", error);
	} finally {
		client.release();
	}
}
