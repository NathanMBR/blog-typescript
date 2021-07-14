// Instance
import app from "./instance/app"

// Port
const { APP_PORT } = process.env;

// Listening
app.listen(APP_PORT, () => {
    console.log(`Server online in localhost:${APP_PORT} at ${new Date()}`);
});