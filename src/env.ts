import dotenv from "dotenv";
import { bool, cleanEnv, port, str, url } from "envalid";

dotenv.config();

export const server_env = cleanEnv(process.env, {
  DB_HOST: str(),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_PORT: port(),

  PORT: port(),
  RENDER_EXTERNAL_URL: url(),
  MALICIOUS_ORIGIN: url(),

  SAME_SITE: str(),
  HTTP_ONLY: bool(),
  SECURE: bool(),
});
