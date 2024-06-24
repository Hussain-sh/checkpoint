import { Pool } from "pg";

const pool = new Pool({
	host: "localhost",
	port: 5432,
	user: "postgres",
	password: "Hussain123",
	database: "checkpoint_db",
});

export default pool;
