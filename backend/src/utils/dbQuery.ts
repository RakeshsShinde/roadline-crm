import { QueryResultRow } from "pg";
import pool from "./db";
import { AppError } from "./ErrorHandler";

//use ts generic to return and receive generic type
export async function executeQuery<T = any>(
  query: string,
  values: any[] = [],
  errorMessage = "Database error",
): Promise<T[]> {
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("DB ERROR:", err);
    throw new AppError(errorMessage, 500);
  }
}
