import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool, types } = pkg;

// DATE columns (job deadlines, event dates, dates of birth) are calendar dates,
// not instants. By default node-pg turns them into JS Dates at midnight in the
// server's own timezone, which JSON-serialises to a UTC instant on the day
// before for any server ahead of UTC ("2026-07-02" -> "2026-07-01T23:00:00Z").
// Writing that value back stores the UTC date part, so every save moved the
// date a day. Handing the raw "YYYY-MM-DD" through keeps the round trip exact.
types.setTypeParser(types.builtins.DATE, (value) => value);

const db = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_DATABASE,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

export default db;