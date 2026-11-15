import express from "express";
import crypto from "node:crypto";
import { db_pool } from "./database.js";
export const userRouter = express.Router();

userRouter.post("/user/login", async (req, res) => {
  const email = req.body.user_email;
  let db_res = await db_pool.query(
    "SELECT email FROM app_users WHERE email = $1::text",
    [email],
  );
  if (db_res.rowCount == 0) {
    db_res = await db_pool.query(
      "INSERT INTO app_users (email) VALUES ($1::text)",
      [email],
    );
  }

  if (!req.session) {
    res.sendStatus(500);
    return;
  }

  req.session["email"] = email;
  req.session["csrf"] = false;
  req.session["csrf_token"] = crypto.randomBytes(32).toString("hex");
  res.sendStatus(200);
});

userRouter.post("/user/logout", async (req, res) => {
  req.session = null;
  res.sendStatus(200);
});
