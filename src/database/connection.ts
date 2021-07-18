// Modules
import dotenv from "dotenv";
import knex from "knex";

// Environment variables
dotenv.config();
const { 
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASSWORD,
    PG_DB,
    PG_HOST_DEV,
    PG_PORT_DEV,
    PG_USER_DEV,
    PG_PASSWORD_DEV,
    PG_DB_DEV,
    APP_MODE
} = process.env;

// Connections
const connections = {
    production: knex({
        client: "pg",
        connection: {
            host: PG_HOST,
            port: PG_PORT as any,
            user: PG_USER,
            password: PG_PASSWORD,
            database: PG_DB
        }
    }),

    development: knex({
        client: "pg",
        connection: {
            host: PG_HOST_DEV,
            port: PG_PORT_DEV as any,
            user: PG_USER_DEV,
            password: PG_PASSWORD_DEV,
            database: PG_DB_DEV
        }
    })
}

// Setting the connection
if (!(APP_MODE === "production" || APP_MODE === "development"))
    throw new Error("Invalid value for APP_MODE environment variable");

const connection = connections[APP_MODE];

// Export
export default connection;