// Instance
import app from "./instance/app";

// Environment variables
import dotenv from "dotenv";
dotenv.config();
const { APP_PORT, IS_APP_IN_PRODUCTION } = process.env;

// Listening
app.listen(APP_PORT, () => {
    console.log(`Connected with ${IS_APP_IN_PRODUCTION == "true" ? "production" : "development"} database`);
    console.log(`Server online in localhost:${APP_PORT} at ${new Date()}`);
});