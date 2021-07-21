// Modules
import { Router, Request, Response } from "express";
const router = Router();
import connection from "../../database/connection";
import { categoriesLengths } from "../../settings/lengths";

// Middlewares

// Routes
router.get("/categories", async (req: Request, res: Response) => {
    const page = isNaN(parseInt(req.query.page as string)) || parseInt(req.query.page as string) <= 1 ? 1 : parseInt(req.query.page as string);

    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const categories = await connection.select()
            .whereNot({is_deleted: true})
            .limit(limit)
            .offset(offset)
            .table("categories");

        res.json({data: categories});
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});

router.get("/categories/:identifier", async (req: Request, res: Response) => {
    const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier) ;
    const errors: Array<string> = [];
    const { max } = categoriesLengths.category

    if (!identifier)
        errors.push("The ID or slug can't be undefined.");
    else {
        if (typeof identifier === "number" && identifier <= 1)
            errors.push("The ID can't be less than 1.");
        else
            if(typeof identifier === "string" && identifier.length > max)
                errors.push(`The slug is too long (must have a maximum of ${max} characters).`);
    }
    
    try {
        if (errors.length === 0) {
            const whereParameter: Object = typeof identifier === "number" ?
                {
                    id: identifier,
                    is_deleted: false
                }
                :
                {
                    slug: identifier,
                    is_deleted: false
                };
            
            const category = await connection.select()
                .where(whereParameter)
                .table("categories");
            
            res.json({data: category});
        } else
            res.status(400).send({errors});
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});
/*
router.post("/categories", async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});

router.patch("/categories", async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});

router.delete("/categories", async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});*/

// Export
export { router };