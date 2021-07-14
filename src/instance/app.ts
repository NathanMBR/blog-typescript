// Modules
import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";

// Settings
app.use(cors());
dotenv.config();

// Routes
import routes from "../routes/routes"
app.use(routes);

// Instance export
export default app;