// Modules
import express from "express";
const app = express();
import cors from "cors";

// Settings
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Routes
import routes from "../routes/routes"
app.use(routes);

// Instance export
export default app;