import { Pool } from "pg";

const pool = new Pool({
	host: "dpg-csagc8rtq21c73911380-a.oregon-postgres.render.com",
	port: 5432,
	user: "postres",
	password: "yDZ5g9ZGI0Bnq56DwAw4tzsGfKzhxe49",
	database: "checkpoint_db",
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
