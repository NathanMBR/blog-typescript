// Modules
import { config } from "dotenv";
config();

// Token expiration
const { JWT_TOKEN_EXPIRES_IN } = process.env 
const tokenExpiration = JWT_TOKEN_EXPIRES_IN ? JWT_TOKEN_EXPIRES_IN : "48h";

// Export
export default tokenExpiration;