// Modules
import express from "express";
const router = express.Router();

// Routes
import { router as homeRouter } from "./home/home.route"
router.use(homeRouter);

export default router;