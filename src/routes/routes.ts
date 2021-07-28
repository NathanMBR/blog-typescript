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

import { router as articlesRouter } from "./articles/articles.route";
router.use("/", articlesRouter);

// API Documentation
import { serve, setup } from "swagger-ui-express";
import { load } from "yamljs";
import path from "path";
router.use("/api-docs", serve, setup(load(path.resolve(__dirname + "../../../swagger.yml"))));

// 404 error for not found pages
router.all("/*", (_req: Request, res: Response) => {
    res.sendStatus(404);
});

export default router;