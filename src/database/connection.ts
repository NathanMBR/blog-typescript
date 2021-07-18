// Modules
import dotenv from "dotenv";
import knex, { Knex } from "knex";

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
    IS_APP_IN_PRODUCTION
} = process.env;

// Connections
const connections = [
    knex({
        client: "pg",
        connection: {
            host: PG_HOST,
            port: PG_PORT as any,
            user: PG_USER,
            password: PG_PASSWORD,
            database: PG_DB
        }
    }),

    knex({
        client: "pg",
        connection: {
            host: PG_HOST_DEV,
            port: PG_PORT_DEV as any,
            user: PG_USER_DEV,
            password: PG_PASSWORD_DEV,
            database: PG_DB_DEV
        }
    })
]

// Setting the connection
let connection: Knex<any, Array<unknown>>;
connection = connections[IS_APP_IN_PRODUCTION == "true" ? 0 : 1];

// Export
export default connection;