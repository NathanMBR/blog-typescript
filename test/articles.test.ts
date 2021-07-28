// Modules
import supertest, { Response as SuperTestResponse } from "supertest";
import app from "../src/instance/app";
import connection from "../src/database/connection";
import slugify from "slugify";
import { sign } from "jsonwebtoken";
import secret from "../src/settings/secret";

// Instance
const request = supertest(app);

// Tests articles
type ArticleFormData = string | number | undefined;

interface Article {
    title: ArticleFormData;
    description: ArticleFormData;
    article: ArticleFormData;
    category_id: ArticleFormData;
    author_id: ArticleFormData;
}

const newArticle: Article = {
    title: "New Article",
    description: "This article is new.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const successArticle: Article = {
    title: "Success Article",
    description: "This article is success.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const repeatedArticle: Article = {
    title: "Repeated Article",
    description: "This article is repeated.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const editArticle1: Article = {
    title: "Edit Article 1",
    description: "This article is edit 1.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const editArticle2: Article = {
    title: "Edit Article 2",
    description: "This article is edit 2.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const deleteArticle1: Article = {
    title: "Delete Article 1",
    description: "This article is delete 1.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

const deleteArticle2: Article = {
    title: "Delete Article 2",
    description: "This article is delete 2.",
    article: "Lorem Ipsum...",
    category_id: 1,
    author_id: 1
};

// Requests
let jwtToken: string = "Bearer ";

const getArticlesByPage = async (
    page?: ArticleFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.get(`/articles?page=${page}`);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const getArticleByIdOrSlug = async (
    identifier: ArticleFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.get(`/articles/${identifier}`);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const createArticle = async (
    title: ArticleFormData,
    description: ArticleFormData,
    article: ArticleFormData,
    category_id: ArticleFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.post("/articles")
            .send({
                title,
                description,
                article,
                category_id
            })
            .set("authorization", jwtToken);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const editArticleByIdOrSlug = async (
    identifier: ArticleFormData,
    title: ArticleFormData,
    description: ArticleFormData,
    article: ArticleFormData,
    category_id: ArticleFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.patch(`/articles/${identifier}`)
            .send({
                title,
                description,
                article,
                category_id
            })
            .set("authorization", jwtToken);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const deleteArticleByIdOrSlug = async (
    identifier: ArticleFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.delete(`/articles/${identifier}`)
            .set("authorization", jwtToken);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
})

// Jest globals
beforeAll(async () => {
    sign({id: 0, email: "test_user@test.api.com", is_admin: true}, secret, {expiresIn: "10 minutes", algorithm: "HS512"}, async (error: Error | null, token: string | undefined) => {
        if (error)
            throw new Error(error as unknown as string);
        else
            jwtToken += token as string;
        
        try {
            await connection
                .insert({
                    category: "Test Category",
                    author_id: 0,
                    slug: slugify("Test Category", {lower: true})
                })
                .into("categories");

            await connection
                .insert({
                    title: successArticle.title,
                    description: successArticle.description,
                    article: successArticle.article,
                    category_id: successArticle.category_id,
                    author_id: successArticle.author_id,
                    slug: slugify(successArticle.title as string, {lower: true})
                })
                .into("articles");
            
            await connection
                .insert({
                    title: repeatedArticle.title,
                    description: repeatedArticle.description,
                    article: repeatedArticle.article,
                    category_id: repeatedArticle.category_id,
                    author_id: repeatedArticle.author_id,
                    slug: slugify(repeatedArticle.title as string, {lower: true})
                })
                .into("articles");

            await connection
                .insert({
                    title: editArticle1.title,
                    description: editArticle1.description,
                    article: editArticle1.article,
                    category_id: editArticle1.category_id,
                    author_id: editArticle1.author_id,
                    slug: slugify(editArticle1.title as string, {lower: true})
                })
                .into("articles");

            await connection
                .insert({
                    title: editArticle2.title,
                    description: editArticle2.description,
                    article: editArticle2.article,
                    category_id: editArticle2.category_id,
                    author_id: editArticle2.author_id,
                    slug: slugify(editArticle2.title as string, {lower: true})
                })
                .into("articles");
            
            await connection
                .insert({
                    title: deleteArticle1.title,
                    description: deleteArticle1.description,
                    article: deleteArticle1.article,
                    category_id: deleteArticle1.category_id,
                    author_id: deleteArticle1.author_id,
                    slug: slugify(deleteArticle1.title as string, {lower: true})
                })
                .into("articles");

            await connection
                .insert({
                    title: deleteArticle2.title,
                    description: deleteArticle2.description,
                    article: deleteArticle2.article,
                    category_id: deleteArticle2.category_id,
                    author_id: deleteArticle2.author_id,
                    slug: slugify(deleteArticle2.title as string, {lower: true})
                })
                .into("articles");
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

afterAll(async () => {
    try {
        await connection
            .truncate()
            .table("categories");

        await connection
            .truncate()
            .table("articles");
    } catch (error) {
        throw new Error(error as string);
    }
});

// Tests
describe("Articles GET tests", () => {
    const stringify = (response: SuperTestResponse): string => JSON.stringify(response.body.data);

    // Getting data by pages
    it("Should successfully return an data array with 10 or less objects", async () => {
        try {
            const response = await getArticlesByPage();
            if (response.body.data)
                expect(response.body.data.length).toBeLessThanOrEqual(10);
            else
                expect(response.body.data).not.toBeUndefined();
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the 200 status code (pagination)", async () => {
        try {
            const response = await getArticlesByPage();
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the first page JSON when receiving a number lesser than 1", async () => {
        try {
            const baseResponse = stringify(await getArticlesByPage(1));
            const response = stringify(await getArticlesByPage(-2));

            expect(response).toBe(baseResponse);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the first page JSON when receiving a non-convertible string", async () => {
        try {
            const baseResponse = stringify(await getArticlesByPage(1));
            const response = stringify(await getArticlesByPage("ABC"));
            expect(response).toBe(baseResponse);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    // Getting data by identifier
    it("Should successfully return an data array with only one object", async () => {
        try {
            const response = await getArticleByIdOrSlug(1);
            if (response.body.data)
                expect(response.body.data.length).toBe(1);
            else
                expect(response.body.data).not.toBeUndefined();
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully return data when receiving an ID", async () => {
        try {
            const response = await getArticleByIdOrSlug(1);
            expect(Array.isArray(response.body.data)).toBe(true);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully return data when receiving a slug", async () => {
        const { title } = successArticle;

        try {
            const response = await getArticleByIdOrSlug(slugify(title as string, {lower: true}));
            expect(Array.isArray(response.body.data)).toBe(true);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the 200 status code (search by ID/slug)", async () => {
        try {
            const response = await getArticleByIdOrSlug(1);
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return an error array when receiving an invalid parameter", async () => {
        try {
            const response = await getArticleByIdOrSlug(-1);
            expect(Array.isArray(response.body.errors)).toBe(true);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Articles POST tests", () => {
    it("Should successfully create an article and return the 201 status code", async () => {
        const { title, description, article } = newArticle;

        try {
            const selectCategory = await connection.select()
                .where({category: "Test Category"})
                .table("categories");
            const category_id = selectCategory[0].id;

            const response = await createArticle(
                title,
                description,
                article,
                category_id
            );

            expect(response.statusCode).toBe(201);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create an article with invalid parameters", async () => {
        try {
            const response = await createArticle(
                undefined,
                undefined,
                undefined,
                undefined
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create an article with parameters that has more characters than allowed", async () => {
        try {
            const response = await createArticle(
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                "article theoretically has unlimited characters, so don't need to test",
                1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create an article that is already created", async () => {
        const { title, description, article, category_id } = repeatedArticle;
        try {
            const response = await createArticle(
                title,
                description,
                article,
                category_id
            )
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Articles PATCH tests", () => {
    it("Should successfully edit an article by ID and return the 200 status code", async () => {
        const { title } = editArticle1;
        
        try {
            const selectArticle = await connection.select()
                .where({title})
                .table("articles");
            const article_id = selectArticle[0].id;

            const selectCategory = await connection.select()
                .where({category: "Test Category"})
                .table("categories");
            const category_id = selectCategory[0].id;

            const response = await editArticleByIdOrSlug(
                article_id,
                "Edited Article 1",
                "This article is edited 1.",
                "Lorem Ipsum...",
                category_id
            );
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully edit an article by slug and return the 200 status code", async () => {
        const { title } = editArticle2;

        try {
            
            const article_slug = slugify(title as string, {lower: true});

            const selectCategory = await connection.select()
                .where({category: "Test Category"})
                .table("categories");
            const category_id = selectCategory[0].id;

            const response = await editArticleByIdOrSlug(
                article_slug,
                "Edited Article 2",
                "This article is edited 2.",
                "Lorem Ipsum...",
                category_id
            );
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit an article with an invalid ID", async () => {
        try {
            const response = await editArticleByIdOrSlug(
                -1,
                "Invalid ID",
                "This ID is invalid.",
                "Lorem Ipsum...",
                1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit an article with an invalid slug", async () => {
        try {
            const response = await editArticleByIdOrSlug(
                undefined,
                "Invalid slug",
                "This slug is invalid.",
                "Lorem Ipsum...",
                1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit an article with invalid parameters", async () => {
        try {
            const selectArticle = await connection.select()
                .where({title: "Edited Article 1"})
                .table("articles");
            const article_id = selectArticle[0].id;

            const response = await editArticleByIdOrSlug(
                article_id,
                undefined,
                undefined,
                undefined,
                undefined
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit an article with parameters that has more characters than allowed", async () => {
        try {
            const selectArticle = await connection.select()
                .where({title: "Edited Article 1"})
                .table("articles");
            const article_id = selectArticle[0].id;

            const response = await editArticleByIdOrSlug(
                article_id,
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                "article theoretically has unlimited characters, so don't need to test",
                1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit an article slug to some other that already exists", async () => {
        const titleThatAlreadyExists = successArticle.title;

        try {
            const selectArticle = await connection.select()
                .where({title: "Edited Article 1"})
                .table("articles");
            const article_id = selectArticle[0].id;

            const response = await editArticleByIdOrSlug(
                article_id,
                titleThatAlreadyExists,
                "This slug already exists.",
                "Lorem Ipsum",
                1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Articles DELETE tests", () => {
    it("Should successfully delete an article by ID and return the 200 status code", async () => {
        const { title } = deleteArticle1;

        try {
            const selectArticle = await connection.select()
                .where({title})
                .table("articles");
            const article_id = selectArticle[0].id;

            const response = await deleteArticleByIdOrSlug(
                article_id
            );
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully delete an article by slug and return the 200 status code", async () => {
        const { title } = deleteArticle2;

        try {
            const article_slug = slugify(title as string, {lower: true});
            const response = await deleteArticleByIdOrSlug(
                article_slug
            );
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not delete an article with an invalid ID", async () => {
        try {
            const response = await deleteArticleByIdOrSlug(
                -1
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not delete an article with an invalid slug", async () => {
        try {
            const response = await deleteArticleByIdOrSlug(
                undefined
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not delete an article that doesn't exists", async () => {
        try {
            const response = await deleteArticleByIdOrSlug(
                "ArticleThatDoesNotExist"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});