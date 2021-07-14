// Modules
import express, { Request, Response } from "express";
const router = express.Router();

// Routes
router.get("/", (_req: Request, res: Response) => {
    res.redirect("/home");
});

router.get("/home", (_req: Request, res: Response) => {
    res.json({
        hello: "world"
    });
});

// Export
export { router };