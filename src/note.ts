import express from "express";
import { db_pool } from "./database.js";
export const noteRouter = express.Router();

noteRouter.post("/note/create", async (req, res) => {
  const user_email = req.session?.["email"];
  if (user_email == undefined) {
    res.sendStatus(401);
    return;
  }

  try {
    await db_pool.query(
      "INSERT INTO notes (user_email, name, text) VALUES ($1::text, $2::text, $3::text)",
      [user_email, req.body.name, req.body.text],
    );
  } catch (error) {
    res.status(400);
    res.send(`error: ${error}`);
    return;
  }
  res.sendStatus(201);
});

noteRouter.post("/note/delete", async (req, res) => {
  const user_email = req.session?.["email"];
  if (user_email == undefined) {
    res.sendStatus(401);
    return;
  }

  try {
    await db_pool.query(
      "DELETE FROM notes WHERE name = $1::text AND user_email = $2::text",
      [req.body.name, user_email],
    );
  } catch (error) {
    res.status(400);
    res.send(`error: ${error}`);
  }
  res.sendStatus(200);
});

noteRouter.post("/note/search", async (req, res) => {
  const user_email = req.session?.["email"];
  if (user_email == undefined) {
    res.sendStatus(401);
    return;
  }
  const note_name = req.body.note_name;
  let db_res;
  try {
    if (req.body.allow_sql) {
      const search_query = `SELECT * FROM notes WHERE user_email ='${user_email}'  AND name = '${note_name}'`;
      db_res = await db_pool.query(search_query);
    } else {
      db_res = await db_pool.query(
        "SELECT * FROM notes WHERE user_email = $1::text AND name = $2::text",
        [user_email, note_name],
      );
    }
  } catch (error) {
    res.status(400);
    res.send(`error: ${error}`);
    return;
  }
  res.status(200);
  res.json(db_res?.rows);
});

noteRouter.post("/note/delete-all", async (req, res) => {
  const csrf_allow = req.session?.["csrf"];
  const user_email = req.session?.["email"];

  const csrf_token = req.headers["x-csrf-token"] ?? "";

  if (!csrf_allow && csrf_token !== req.session?.["csrf_token"]) {
    res.status(403).json({
      error: "Invalid CSRF token",
    });
    return;
  }

  if (user_email == undefined) {
    res.sendStatus(401);
    return;
  }

  try {
    await db_pool.query("DELETE FROM notes WHERE user_email = $1::text", [
      user_email,
    ]);
  } catch (error) {
    res.status(400);
    res.send(`error: ${error}`);
  }
  res.sendStatus(200);
});
