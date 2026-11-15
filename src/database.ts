import { Pool } from "pg";
import { server_env } from "./env.js";

export const db_pool = new Pool({
  host: server_env.DB_HOST,
  port: server_env.DB_PORT,
  user: server_env.DB_USER,
  password: server_env.DB_PASSWORD,
  database: server_env.DB_NAME,
});

export async function database_init() {
  const db_user_res = await db_pool.query(
    "CREATE TABLE IF NOT EXISTS app_users (email VARCHAR(255) PRIMARY KEY);",
  );

  const db_note_res = await db_pool.query(
    "CREATE TABLE IF NOT EXISTS notes (name VARCHAR(255) PRIMARY KEY, text VARCHAR(1000) NOT NULL, user_email VARCHAR(255) NOT NULL, FOREIGN KEY (user_email) REFERENCES app_users(email));",
  );
}
