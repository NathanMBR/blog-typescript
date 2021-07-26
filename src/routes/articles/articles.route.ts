// Modules
import { Router, Request, Response } from "express";
const router = Router();
import connection from "../../database/connection";
import slugify from "slugify";

// Settings
import { articlesLengths } from "../../settings/lengths";

// Middlewares
import isLogged from "../../middlewares/isLogged";
import isAdmin from "../../middlewares/isAdmin";

// Routes
router.get("/articles", async (req: Request, res: Response) => {
    try {
        const page = isNaN(parseInt(req.query.page as string)) || parseInt(req.query.page as string) <= 1 ? 1 : parseInt(req.query.page as string);

        // Defining search parameters
        const limit = 10;
        const offset = (page - 1) * limit;

        // Searching
        const articles = await connection.select()
            .where({is_deleted: false})
            .limit(limit)
            .offset(offset)
            .table("articles");

        res.json({data: articles});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.get("/articles/:identifier", async (req: Request, res: Response) => {
    try {
        const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
        const errors: Array<string> = [];
        const { max } = articlesLengths.title;

        // Validations
        if (!identifier)
            errors.push("The ID or slug can't be undefined.");
        else if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be lesser than 1.");
        else if(typeof identifier === "string" && identifier.length > max)
            errors.push(`The slug is too long (must have a maximum of ${max} characters).`);
        else if (typeof identifier !== "number" && typeof identifier !== "string")
            errors.push("The ID or slug is not valid.");

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
            const article = await connection.select()
                .where(whereParameter)
                .table("articles");

            res.json({data: article});
        } else
            res.status(400).json({errors});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.post("/articles", isLogged, isAdmin, async (req: Request, res: Response) => {
    try {
        const { title, description, article, category_id } = req.body;
        const { id } = JSON.parse(req.headers.user as string); // author_id
        const errors: Array<string> = [];

        // Validations
        if (!title)
            errors.push("The title can't be undefined.");
        else if (typeof title !== "string")
            errors.push("The title must be a string.");
        else if (title.length > articlesLengths.title.max)
            errors.push(`The title is too long (must have a maximum of ${articlesLengths.title.max} characters).`);
        else if (!isNaN(parseInt(title)))
            errors.push("The title can't be a number.");

        if (!description)
            errors.push("The description can't be undefined.");
        else if (typeof description !== "string")
            errors.push("The description must be a string.");
        else if (description.length > articlesLengths.description.max)
            errors.push(`The description is too long (must have a maximum of ${articlesLengths.description.max}).`);
        else if (!isNaN(parseInt(description)))
            errors.push("The description can't be a number.");

        if (!article)
            errors.push("The article can't be undefined.");
        else if (typeof article !== "string")
            errors.push("The article must be a string.");

        if (!category_id)
            errors.push("The article category can't be undefined.");
        else if (typeof category_id !== "number" && isNaN(parseInt(category_id)))
            errors.push("The article category ID must be a number or a convertible string.");

        // Asynchronous validations
        if (errors.length === 0) {
            const doesArticleCategoryExists = (await connection.select()
                .where({
                    id: parseInt(category_id),
                    is_deleted: false
                })
                .table("categories"))[0];
            if (!doesArticleCategoryExists)
                errors.push("The article category doesn't exist.");

            const doesArticleSlugAlreadyExists = (await connection.select()
                .where({
                    slug: slugify(title as string, {lower: true}),
                    is_deleted: false
                })
                .table("articles"))[0];
            if (doesArticleSlugAlreadyExists)
                errors.push("The article title already exists.");
        }

        // Error check
        if (errors.length === 0) {
            await connection
                .insert({
                    title,
                    description,
                    article,
                    category_id: parseInt(category_id),
                    author_id: id,
                    slug: slugify(title as string, {lower: true})
                })
                .into("articles");
            
            res.sendStatus(201);
        } else
            res.status(400).json({errors});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.patch("/articles/:identifier", isLogged, isAdmin, async (req: Request, res: Response) => {
    try {
        const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
        const { title, description, article, category_id } = req.body;
        const errors: Array<string> = [];

        // Validations
        if (!identifier)
            errors.push("The ID or slug can't be undefined.");
        else if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be lesser than 1.");
        else if(typeof identifier === "string" && identifier.length > articlesLengths.title.max)
            errors.push(`The slug is too long (must have a maximum of ${articlesLengths.title.max} characters).`);
        else if (typeof identifier !== "number" && typeof identifier !== "string")
            errors.push("The ID or slug is not valid.");

        if (!title)
            errors.push("The title can't be undefined.");
        else if (typeof title !== "string")
            errors.push("The title must be a string.");
        else if (title.length > articlesLengths.title.max)
            errors.push(`The title is too long (must have a maximum of ${articlesLengths.title.max} characters).`);
        else if (!isNaN(parseInt(title)))
            errors.push("The title can't be a number.");

        if (!description)
            errors.push("The description can't be undefined.");
        else if (typeof description !== "string")
            errors.push("The description must be a string.");
        else if (description.length > articlesLengths.description.max)
            errors.push(`The description is too long (must have a maximum of ${articlesLengths.description.max}).`);
        else if (!isNaN(parseInt(description)))
            errors.push("The description can't be a number.");

        if (!article)
            errors.push("The article can't be undefined.");
        else if (typeof article !== "string")
            errors.push("The article must be a string.");

        if (!category_id)
            errors.push("The article category can't be undefined.");
        else if (typeof category_id !== "number" && isNaN(parseInt(category_id)))
            errors.push("The article category ID must be a number or a convertible string.");

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

        // Asynchronous validations
        if (errors.length === 0) {
            const whereNotParameter: Object = typeof identifier === "number" ?
                {
                    id: identifier
                }
                    :
                {
                    slug: identifier
                };
            
            const doesIdentifierExists = (await connection.select()
                .where(whereParameter)
                .table("articles"))[0];
            if (!doesIdentifierExists)
                errors.push("The ID or slug doesn't exist.");

            const doesArticleCategoryExists = (await connection.select()
                .where({
                    id: parseInt(category_id),
                    is_deleted: false
                })
                .table("categories"))[0];
            if (!doesArticleCategoryExists)
                errors.push("The article category doesn't exist.");

            const doesArticleSlugAlreadyExists = (await connection.select()
                .where({
                    slug: slugify(title as string, {lower: true}),
                    is_deleted: false
                })
                .whereNot(whereNotParameter)
                .table("articles"))[0];
            if (doesArticleSlugAlreadyExists)
                errors.push("The article title already exists.");
        }
        
        // Error check
        if (errors.length === 0) {
            await connection
                .update({
                    title,
                    description,
                    article,
                    category_id: parseInt(category_id),
                    slug: slugify(title as string, {lower: true})
                })
                .where(whereParameter)
                .table("articles");
            
            res.sendStatus(200);
        } else
            res.status(400).json({errors});
    } catch (error) {
        console.error(error as string);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

router.delete("/articles/:identifier", isLogged, isAdmin, async (req: Request, res: Response) => {
    try {
        const identifier = isNaN(parseInt(req.params.identifier)) ? req.params.identifier : parseInt(req.params.identifier);
        const errors: Array<string> = [];

        // Validations
        if (!identifier)
            errors.push("The ID or slug can't be undefined.");
        else if (typeof identifier === "number" && identifier < 1)
            errors.push("The ID can't be lesser than 1.");
        else if(typeof identifier === "string" && identifier.length > articlesLengths.title.max)
            errors.push(`The slug is too long (must have a maximum of ${articlesLengths.title.max} characters).`);
        else if (typeof identifier !== "number" && typeof identifier !== "string")
            errors.push("The ID or slug is not valid.");

        // Asynchronous validations
        const whereParameter = typeof identifier === "number" ?
            {
                id: identifier,
                is_deleted: false
            }
                :
            {
                slug: identifier,
                is_deleted: false
            };

        if (errors.length === 0) {
            const doesArticleExists = (await connection.select()
                .where(whereParameter)
                .table("articles"))[0];
            if (!doesArticleExists)
                errors.push("The ID or slug doesn't exist.");
        }
        
        // Error check
        if (errors.length === 0) {
            await connection
                .update({
                    is_deleted: true
                })
                .where(whereParameter)
                .table("articles");
            
            res.sendStatus(200);
        } else
            res.status(400).json({errors});
    } catch (error) {
        console.error(error);
        res.status(500).json({errors: [
            "Internal server error."
        ]});
    }
});

// Export
export { router };