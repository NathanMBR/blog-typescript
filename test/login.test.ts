// Modules
import supertest, { Response as SuperTestResponse } from "supertest";
import app from "../src/instance/app";
import connection from "../src/database/connection";
import { genSalt, hash } from "bcryptjs";

// Instance
const request = supertest(app);

// Test users
type UserLoginFormData = string | undefined;

interface UserLogin {
    email: UserLoginFormData,
    password: UserLoginFormData
}

const successUser: UserLogin = {
    email: "success@user.com",
    password: "success8"
}

// Requests
const login = async (
    email: UserLoginFormData,
    password: UserLoginFormData
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    const user: UserLogin = {
        email,
        password
    };

    try {
        const response = await request.post("/login").send(user);
        resolve(response);
    } catch(error) {
        reject(error as string);
    }
});

// Jest globals
beforeAll(async () => {
    const { email, password } = successUser;
    
    try {
        const salt = await genSalt(12);
        const hashedPassword = await hash(password as string, salt);
        await connection.insert({
            name: "b",
            email,
            password: hashedPassword,
            profile_picture: null,
            slug: "b"
        }).into("users");
    } catch (error) {
        throw new Error(error as string);
    }
});

afterAll(async () => {
    try {
        await connection.truncate()
            .table("users");
    } catch (error) {
        throw new Error(error as string);
    }
});

// Tests
describe("User authentication tests", () => {
    it("Should successfully authenticate", async () => {
        const { email, password } = successUser;

        try {
            const response = await login(
                email,
                password
            );
            expect(response.statusCode).toBe(200);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not authenticate an e-mail that is invalid", async () => {
        try {
            const response = await login(
                "",
                "test1-78"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not authenticate an e-mail that doesn't exist", async () => {
        try {
            const response = await login(
                "does@not.exists",
                "test2-78"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not authenticate with a password that is invalid", async () => {
        try {
            const response = await login(
                "test3@gmail.com",
                ""
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not authenticate with a password that has less than eight characters", async () => {
        try {
            const response = await login(
                "test4@gmail.com",
                "12345"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not authenticate with a password that doesn't match with the email", async () => {
        const { email } = successUser;

        try {
            const response = await login(
                email,
                "test5-78"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    test("If the incorrect email and password messages are equal", async () => {
        const successEmail = successUser.email;
        
        try {
            const incorrectEmail = await login(
                "does@not.exists",
                "test6-78"
            );

            const incorrectPassword = await login(
                successEmail,
                "incorrectPassword"
            );

            expect(incorrectEmail.body.errors[0]).toBe(incorrectPassword.body.errors[0]);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});