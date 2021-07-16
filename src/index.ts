// Instance
import app from "./instance/app";

// Migrations
import runMigrations from "./database/migrations";

// Environment variables
import dotenv from "dotenv";
dotenv.config();
const { APP_PORT, AUTO_RUN_MIGRATIONS } = process.env;

// Listening
app.listen(APP_PORT, () => {
    console.log(`Server online in localhost:${APP_PORT} at ${new Date()}`);
    if (AUTO_RUN_MIGRATIONS === "true")
        runMigrations();
});