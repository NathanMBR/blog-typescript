// Instance
import app from "./instance/app";

// Environment variables
import dotenv from "dotenv";
dotenv.config();
const { APP_PORT, APP_MODE } = process.env;

// Listening
app.listen(APP_PORT, () => {
    console.log(`Connected with ${APP_MODE} database`);
    console.log(`Server online in localhost:${APP_PORT} at ${new Date()}`);
});