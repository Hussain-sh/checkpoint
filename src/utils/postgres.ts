import { Pool } from "pg";
const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
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
