// Modules
import supertest, { Response } from "supertest";
import app from "../src/instance/app";
import connection from "../src/database/connection";

// Instance
const request = supertest(app);

// Test users
interface UserSignup {
    name: string;
    email: string;
    password: string;
    confirmEmail?: string;
    confirmPassword?: string;
}

const successUser: UserSignup = {
    name: "Success User",
    email: "success@user.com",
    password: "success8"
};

// Requests
const signup = async (
    name: string,
    email: string,
    password: string,
    confirmEmail: string = email,
    confirmPassword: string = password
) => new Promise<Response>(async (resolve: Function, reject: Function) => {
    const user = {
        name,
        email,
        password,
        confirmEmail,
        confirmPassword
    };

    try {
        const response = await request.post("/signup").send(user);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Jest globals
afterAll(async () => {
    const { name } = successUser;

    try {
        await connection.delete()
            .where({name})
            .table("users");
    } catch (error) {
        throw new Error(error as string);
    }
});

// Tests
describe("User creation tests", () => {
    it("Should successfully create the account", async () => {
        const { name, email, password } = successUser;

        try {
            const response = await signup(
                name,
                email,
                password
            );
            expect(response.statusCode).toBe(201);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});