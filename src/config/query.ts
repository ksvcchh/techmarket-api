import { pool } from "./db";

export default function query(queryText: string, ...params: any[]) {
  return pool.query(queryText, params);
}
