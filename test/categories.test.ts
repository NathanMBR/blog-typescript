// Modules
import supertest, { Response as SuperTestResponse } from "supertest";
import app from "../src/instance/app";
import connection from "../src/database/connection";
import slugify from "slugify";
import { sign } from "jsonwebtoken";
import secret from "../src/settings/secret";

// Instance
const request = supertest(app);

// Test categories
type CategoryFormData = string | undefined;

interface Category {
    category: CategoryFormData
}

const successCategory: Category = {
    category: "Success Category"
};

const repeatedCategory: Category = {
    category: "Repeated Category"
}

const newCategory: Category = {
    category: "New Category"
}

const deleteCategory1: Category = {
    category: "Delete Category By ID"
}

const deleteCategory2: Category = {
    category: "Delete Category By Slug"
}

// Requests
let jwtToken: string = "Bearer ";

const getCategoriesByPage = async (
    page: CategoryFormData | number = 1
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.get(`/categories?page=${page}`);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const getCategoryByIdOrSlug = async (
    categoryIdentifier: CategoryFormData | number
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.get(`/categories/${categoryIdentifier}`);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const createCategory = async (
    category: CategoryFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.post("/categories")
            .send({category})
            .set("authorization", jwtToken);
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const editCategoryByIdOrSlug = async (
    categoryIdentifier: CategoryFormData | number,
    newCategoryName: CategoryFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.patch(`/categories/${categoryIdentifier}`)
            .send({category: newCategoryName})
            .set("authorization", jwtToken);
            
        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

const deleteCategoryByIdOrSlug = async(
    categoryIdentifier: CategoryFormData | number
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    try {
        const response = await request.delete(`/categories/${categoryIdentifier}`)   
            .set("authorization", jwtToken);

        resolve(response);
    } catch (error) {
        reject(error as string);
    }
});

// Jest globals
beforeAll(() => {
    sign({id: 0, email: "test_user@test.api.com", is_admin: true}, secret, {expiresIn: "10 minutes", algorithm: "HS512"}, async (error: Error | null, token: string | undefined) => {
        if (error)
            throw new Error(error as unknown as string);
        else
            jwtToken += token as string;

        try {
            await connection.insert({
                category: successCategory.category,
                author_id: 0,
                slug: slugify(successCategory.category as string, {lower: true})
            }).into("categories");

            await connection.insert({
                category: repeatedCategory.category,
                author_id: 0,
                slug: slugify(repeatedCategory.category as string, {lower: true})
            }).into("categories");

            await connection.insert({
                category: deleteCategory1.category,
                author_id: 0,
                slug: slugify(deleteCategory1.category as string, {lower: true})
            }).into("categories");

            await connection.insert({
                category: deleteCategory2.category,
                author_id: 0,
                slug: slugify(deleteCategory2.category as string, {lower: true})
            }).into("categories");
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

afterAll(async () => {
    try {
        await connection.truncate()
            .table("categories");
    } catch (error) {
        throw new Error(error as string);
    }
});

// Tests
describe("Categories GET tests", () => {
    const stringify = (response: SuperTestResponse): string => JSON.stringify(response.body.data);

    // Getting data by pages
    it("Should successfully return an data array with 10 or less objects", async () => {
        try {
            const response = await getCategoriesByPage();

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
            const response = await getCategoriesByPage();
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the first page JSON when receiving a number lesser than 1", async () => {
        try {
            const baseResponse = stringify(await getCategoriesByPage(1));
            const response = stringify(await getCategoriesByPage(-2));

            expect(response).toBe(baseResponse);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the first page JSON when receiving a non-convertible string", async () => {
        try {
            const baseResponse = stringify(await getCategoriesByPage(1));
            const response = stringify(await getCategoriesByPage("non-convertible"));

            expect(response).toBe(baseResponse);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    // Getting data by identifier
    it("Should successfully return an data array with only one object", async () => {
        try {
            const response = await getCategoryByIdOrSlug(1);

            if (response.body.data)
                expect(response.body.data.length).toBe(1);
            else
                expect(response.body.data).not.toBeUndefined();
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully return data when receiving an ID", async () => {
        const { category } = successCategory;

        try {
            const select = await connection.select()
                .where({category})
                .table("categories");
            const { id } = select[0];

            const response = await getCategoryByIdOrSlug(id);
            expect(typeof response.body.data).toBe("object");
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully return data when receiving a slug", async () => {
        const { category } = successCategory;

        try {
            const response = await getCategoryByIdOrSlug(slugify(category as string, {lower: true}));
            expect(typeof response.body.data).toBe("object");
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return the 200 status code (search by id/slug)", async () => {
        const { category } = successCategory;

        try {
            const response = await getCategoryByIdOrSlug(slugify(category as string, {lower: true}));
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return an error array when receiving an invalid parameter", async () => {
        try {
            const response = await getCategoryByIdOrSlug(-123);
            expect(Array.isArray(response.body.errors)).toBe(true);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Categories POST tests", () => {
    it("Should successfully create a category and return the 201 status code", async () => {
        const { category } = newCategory;

        try {
            const response = await createCategory(category);
            expect(response.statusCode).toBe(201);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create a category with an invalid name", async () => {
        try {
            const response = await createCategory(undefined);
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create a category with more than 50 characters", async () => {
        try {
            const response = await createCategory("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not create a category that is already created", async () => {
        const { category } = repeatedCategory;
        try {
            const response = await createCategory(category);
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Categories PATCH tests", () => {
    it("Should successfully edit a category by ID and return the 200 status code", async () => {
        const { category } = repeatedCategory; 

        try {
            const select = await connection.select()
                .where({category})
                .table("categories");
            const { id } = select[0];
            
            const response = await editCategoryByIdOrSlug(id as number, "New Category 2");
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });
    
    it("Should successfully edit a category by slug and return the 200 status code", async () => {
        try {
            const response = await editCategoryByIdOrSlug(slugify("New Category 2", {lower: true}), "New Category 3");
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not edit a category with an invalid ID", async () => {
        try {
            const response = await editCategoryByIdOrSlug(-1, "Foo");
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not accept an invalid new category name", async () => {
        try {
            const response = await editCategoryByIdOrSlug(slugify("New Category 3", {lower: true}), undefined);
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not accept a new category name that has more than 50 characters", async () => {
        try {
            const response = await editCategoryByIdOrSlug(slugify("New Category 3", {lower: true}), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not accept a new category name that already exists", async () => {
        const { category } = successCategory;

        try {
            const response = await editCategoryByIdOrSlug(slugify("New Category 3", {lower: true}), category as string);
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});

describe("Categories DELETE tests", () => {
    it("Should successfully delete a category by ID and return the 200 status code", async () => {
        try {
            const select = await connection.select()
                .where({category: deleteCategory1.category})
                .table("categories");
            const { id } = select[0];

            const response = await deleteCategoryByIdOrSlug(id);
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should successfully delete a category by slug and return the 200 status code", async () => {
        try {
            const select = await connection.select()
                .where({category: deleteCategory2.category})
                .table("categories");
            const { slug } = select[0];

            const response = await deleteCategoryByIdOrSlug(slug);
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not delete when receiving an invalid ID", async () => {
        try {
            const response = await deleteCategoryByIdOrSlug(-7);
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not delete an category that doesn't exists", async () => {
        try {
            const response = await deleteCategoryByIdOrSlug("does not exist");
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});