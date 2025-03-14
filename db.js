import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

console.log("DB_URL from ENV:", process.env.DB_URL);

export default pool;