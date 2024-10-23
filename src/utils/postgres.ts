import { Pool } from "pg";
const pool = new Pool({
	host: "pg-3c0d397f-checkpoint-first.g.aivencloud.com",
	port: 13919,
	user: "avnadmin",
	password: "AVNS_6sPCnn6xGMyPU0UHybN",
	database: "checkpoint_db",
	ssl: {
		rejectUnauthorized: false,
	},
});

pool
	.connect()
	.then((client) => {
		console.log("Connected to the database!");
		client.release();
	})
	.catch((err) => {
		console.error("Connection error", err.stack);
	});

export default pool;
