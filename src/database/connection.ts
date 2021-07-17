// Modules
import knex from "knex";
import dotenv from "dotenv";

// Environment variables
dotenv.config();
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

// Connections
const production = knex({
    client: "pg",
        connection: {
            host: PG_HOST,
            port: (PG_PORT as any),
            user: PG_USER,
            password: PG_PASSWORD,
            database: PG_DB
        }
});

const development = knex({
    client: "sqlite3",
    connection: {
        filename: "./development/dev.sqlite3"
    }
});

// Export
export {
    production,
    development
}