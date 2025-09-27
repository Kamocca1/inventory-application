import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_LOCAL_URL,
});

// Test the connection on startup
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection test failed:", err);
    } else {
        console.log("Database connection test successful");
    }
});

// Test connection on startup
pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
    console.error("Database connection error:", err);
});
