// Modules
import knex from "knex";
import dotenv from "dotenv";

// Environment variables
dotenv.config();
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

// Pool
const connection = knex({
    client: "pg",
    connection: {
        host: PG_HOST,
        port: (PG_PORT as any),
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DB
    }
});

export default connection;