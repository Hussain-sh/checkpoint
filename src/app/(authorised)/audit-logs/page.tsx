"use client";

import { getAuditLogs } from "@/app/actions/auditLogAction";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

interface AuditLogs {
	logtype: string;
	feature: string;
	action: string;
	user_id: number | null;
	created_at: Date;
}
export default function AuditLogsPage() {
	const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);

	useEffect(() => {
		const fetchAuditLogsData = async () => {
			const auditLogs = await getAuditLogs();
			setAuditLogsData(auditLogs || []);
		};
		fetchAuditLogsData();
	}, []);

	const columnDefs: ColDef[] = [
		{ headerName: "Id", field: "id", sortable: false, hide: true },
		{
			headerName: "Logtype",
			field: "log_type",
			sortable: false,
			filter: true,
			width: 150,
		},
		{
			headerName: "Feature",
			field: "feature",
			sortable: false,
			filter: true,
			width: 150,
		},
		{
			headerName: "Action",
			field: "action",
			sortable: false,
			filter: true,
			width: 500,
		},
		{
			headerName: "Created On",
			field: "created_at",
			sortable: false,
			filter: true,
			width: 150,
		},
	];

	return (
		<div>
			<div className="h-screen w-full px-10 py-10">
				<div className="ag-theme-quartz mx-auto w-full h-full overflow-auto ">
					<AgGridReact
						rowData={auditLogsData}
						columnDefs={columnDefs}
						pagination={true}
						paginationPageSize={10}
					/>
				</div>
			</div>
		</div>
	);
}
