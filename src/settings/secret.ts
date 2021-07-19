// Modules
import { config } from "dotenv";
config();

// Secret
const { APP_SECRET } = process.env;
if (!APP_SECRET)
    throw new Error("The APP_SECRET environment variable can't be undefined.");

// Export
export default APP_SECRET as string;