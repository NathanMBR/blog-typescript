// Modules
import supertest from "supertest";
import app from "../src/instance/app";

// Instance
const request = supertest(app);

// Tests
describe("Initial pages testing", () => {
    it("Should return status 302", async () => {
        try {
            const response = await request.get("/");
            expect(response.statusCode).toBe(302);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should return an Hello World message", async () => {
        try {
            const response = await request.get("/home");
            expect(response.body.hello).toBe("world");
        } catch (error) {
            throw new Error(error as string);
        }
    });
});