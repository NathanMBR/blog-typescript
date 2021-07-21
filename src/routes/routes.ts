// Modules
import { Router, Request, Response } from "express";
const router = Router();

// Routes
import { router as homeRouter } from "./home/home.route";
router.use("/", homeRouter);

import { router as signupRouter } from "./users/signup.route";
router.use("/", signupRouter);

import { router as loginRouter } from "./users/login.route";
router.use("/", loginRouter);

import { router as categoriesRouter } from "./categories/categories.route";
router.use("/", categoriesRouter);

router.all("/*", (_req: Request, res: Response) => {
    res.sendStatus(404);
});

export default router;