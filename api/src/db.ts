import { Pool, QueryResult } from "pg";

// connection pool
export const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
    return pool.query(text, params);
};
