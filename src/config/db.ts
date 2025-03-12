import { Pool } from "pg";
import fs from "fs";
import path from "path";

export const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.PORT_DB || "5432"),
});

export async function initDb() {
  const initScript = fs
    .readFileSync(path.join(__dirname, "init.sql"))
    .toString();
  try {
    await pool.query(initScript);
    console.log("Database has been initialised!");
  } catch (err) {
    console.error(`Error initialising database: ${err}`);
  }
}

initDb();
