import express from "express";
import { db_pool } from "./database.js";
export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  const user_email = req.session?.["email"];
  if (user_email == undefined) {
    res.render("index.ejs");
    return;
  }
  const csrf_token = req.session?.["csrf_token"];
  let db_res = await db_pool.query(
    "SELECT COUNT(*) FROM notes WHERE user_email = $1::text",
    [user_email],
  );
  const note_num = db_res.rows[0].count;
  res.render("logged_in.ejs", {
    current_user: {
      user_email,
      note_num,
      csrf_token: csrf_token,
      csrf_allow: req.session?.["csrf"],
    },
  });
});
