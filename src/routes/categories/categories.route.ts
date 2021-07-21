// Modules
import { Router, Request, Response } from "express";
const router = Router();
import connection from "../../database/connection";
import { categoriesLengths } from "../../settings/lengths";
import slugify from "slugify";

// Middlewares
import isLogged from "../../middlewares/isLogged";
import isAdmin from "../../middlewares/isAdmin";

// Routes
router.get("/categories", async (req: Request, res: Response) => {
    const page = isNaN(parseInt(req.query.page as string)) || parseInt(req.query.page as string) <= 1 ? 1 : parseInt(req.query.page as string);

    // Defining search parameters
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        // Searching
        const categories = await connection.select()
            .where({is_deleted: false})
            .limit(limit)
            .offset(offset)
            .table("categories");

        res.json({data: categories});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.get("/categories/:identifier", async (req: Request, res: Response) => {
    const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
    const errors: Array<string> = [];
    const { max } = categoriesLengths.category;

    // Validations
    if (!identifier)
        errors.push("The ID or slug can't be undefined.");
    else {
        if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be less than 1.");
        else
            if(typeof identifier === "string" && identifier.length > max)
                errors.push(`The slug is too long (must have a maximum of ${max} characters).`);
    }
    
    try {
        // Error check
        if (errors.length === 0) {
            // Defining search parameter
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
            
            // Searching
            const category = await connection.select()
                .where(whereParameter)
                .table("categories");
            
            res.json({data: category});
        } else
            res.status(400).send({errors});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.post("/categories", isLogged, isAdmin, async (req: Request, res: Response) => {
    const { category } = req.body;
    const errors: Array<string> = [];
    const { max } = categoriesLengths.category;
    const { id } = JSON.parse(req.headers.user as string);

    // Validations
    if (!category)
        errors.push("The category name can't be undefined.");
    else if (typeof category !== "string")
        errors.push("The category name must be a string.");
    else {
        if (category.length > max)
            errors.push(`The category name is too long (must have a maximum of ${max} characters).`);
        
        if (!isNaN(parseInt(category)))
            errors.push("The category name can't be a number.");
    }

    // Error check
    if (errors.length === 0) {
        try {
            // Asynchronous validations
            const asyncErrors: Array<string> = [];

            const doesCategoryAlreadyExists = (await connection.select()
                .where({
                    slug: slugify(category, {lower: true}),
                    is_deleted: false
                })
                .table("categories"))[0];

            if (doesCategoryAlreadyExists)
                asyncErrors.push("The category name already exists.");

            // Asynchronous error check
            if (asyncErrors.length === 0) {
                await connection.insert({
                    category,
                    author_id: id,
                    slug: slugify(category, {lower: true})
                }).into("categories");

                res.sendStatus(201);
            } else
                res.status(400).json({errors: asyncErrors});
        } catch (error) {
            console.error(error as string);
            res.status(500).json({errors: [
                "Internal server error."
            ]});
        }
    } else
        res.status(400).json({errors});
});

router.patch("/categories/:identifier", isLogged, isAdmin, async (req: Request, res: Response) => {
    const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
    const { category } = req.body;
    const errors: Array<string> = [];
    const { max } = categoriesLengths.category;

    // Validations
    if (!identifier)
        errors.push("The ID or slug can't be undefined.");
    else {
        if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be less than 1.");
        else
            if(typeof identifier === "string" && identifier.length > max)
                errors.push(`The slug is too long (must have a maximum of ${max} characters).`);
    }

    if (!category)
        errors.push("The category name can't be undefined.");
    else if (typeof category !== "string")
        errors.push("The category name must be a string.");
    else {
        if (category.length > max)
            errors.push(`The category name is too long (must have a maximum of ${max} characters).`);

        if (!isNaN(parseInt(category)))
            errors.push("The category name can't be a number.");
    }

    // Error check
    if (errors.length === 0) {
        try {
            const asyncErrors: Array<string> = [];
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

            const whereNotParameter: Object = typeof identifier === "number" ?
                {
                    id: identifier
                }
                    :
                {
                    slug: identifier
                };
            // Asynchronous validations
            const doesIdentifierExists = (await connection.select()
                .where(whereParameter)
                .table("categories"))[0];

            if (!doesIdentifierExists)
                asyncErrors.push("The ID or slug doesn't exist.");

            const doesCategoryAlreadyExists = (await connection.select()
                .where({
                    slug: slugify(category, {lower: true}),
                    is_deleted: false
                })
                .whereNot(whereNotParameter)
                .table("categories"))[0];

            if (doesCategoryAlreadyExists)
                asyncErrors.push("The category name already exists.");

            // Asynchronous error check
            if (asyncErrors.length === 0) {
                await connection
                    .update({
                        category,
                        slug: slugify(category, {lower: true})
                    })
                    .where(whereParameter)
                    .table("categories");

                res.sendStatus(200);
            } else
                res.status(400).send({errors: asyncErrors});
        } catch (error) {
            console.error(error as string);
            res.status(500).json({errors: [
                "Internal server error."
            ]});
        }
    } else
        res.status(400).send({errors});
        
});

router.delete("/categories/:identifier", isLogged, isAdmin, async (req: Request, res: Response) => {
    const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
    const errors: Array<string> = [];
    const { max } = categoriesLengths.category;

    // Validations
    if (!identifier)
        errors.push("The ID or slug can't be undefined.");
    else {
        if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be less than 1.");
        else
            if(typeof identifier === "string" && identifier.length > max)
                errors.push(`The slug is too long (must have a maximum of ${max} characters).`);
    }
    
    // Error check
    if (errors.length === 0) {
        try {
            const asyncErrors: Array<string> = [];
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
            
            // Asynchronous validation
            const doesIdentifierExists = (await connection.select()
                .where(whereParameter)
                .table("categories"))[0];
            
            if (!doesIdentifierExists)
                asyncErrors.push("The ID or slug doesn't exist.");
            
            // Asynchronous error check
            if (asyncErrors.length === 0) {
                await connection
                    .update({
                        is_deleted: true
                    })
                    .where(whereParameter)
                    .table("categories");
                
                res.sendStatus(200);
            } else
                res.status(400).json({errors: asyncErrors});
        } catch (error) {
            console.error(error as string);
            res.status(500).json({errors: [
                "Internal server error."
            ]});
        }
    } else
        res.status(400).json({errors});
});

// Export
export { router };