// Instance
import app from "./instance/app";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

const { APP_PORT } = process.env;

// Listening
app.listen(APP_PORT, () => {
    console.log(`Server online in localhost:${APP_PORT} at ${new Date()}`);
});