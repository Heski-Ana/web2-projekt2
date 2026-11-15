import cookieSession from "cookie-session";
import express from "express";
import { database_init } from "./database.js";
import { server_env } from "./env.js";
import { homeRouter } from "./home.js";
import { noteRouter } from "./note.js";
import { userRouter } from "./user.js";
import { vulnerabilityRouter } from "./vulnerability.js";

export const app = express();

database_init();

app.use(
  cookieSession({
    name: "session_id",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: server_env.SAME_SITE as
      | boolean
      | "strict"
      | "lax"
      | "none"
      | undefined,
    httpOnly: server_env.HTTP_ONLY,
    secure: server_env.SECURE,
    keys: ["kljuc"],
  }),
);
app.use(express.json());

app.use("/", homeRouter);
app.use("/", noteRouter);
app.use("/", userRouter);
app.use("/", vulnerabilityRouter);

const externalUrl = server_env.RENDER_EXTERNAL_URL ?? undefined;
const port = externalUrl && server_env.PORT ? server_env.PORT : 3000;
const baseURL = externalUrl || `http://localhost:${port}`;
const hostname = externalUrl ? "0.0.0.0" : "127.0.0.";

app.listen(port, hostname, () => {
  console.log(`Server locally running at ${baseURL}`);
  if (externalUrl) {
    console.log(`External URL: ${externalUrl}`);
  }
});
