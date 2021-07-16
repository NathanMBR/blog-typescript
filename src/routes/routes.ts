// Modules
import express, { Request, Response } from "express";
const router = express.Router();

// Routes
import { router as homeRouter } from "./home/home.route";
router.use("/", homeRouter);

import { router as signupRouter } from "./users/signup.route";
router.use("/", signupRouter);

router.all("/*", (_req: Request, res: Response) => {
    res.sendStatus(404);
});

export default router;