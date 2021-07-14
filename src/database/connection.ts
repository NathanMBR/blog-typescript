// Modules
import knex from "knex";

// Environment variables
const { PG_HOST, PG_USER, PG_PASSWORD, PG_DB,  } = process.env;

// Pool
const connection = knex({
    client: "pg",
    connection: {
        host: PG_HOST,
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DB
    }
});

export default connection;