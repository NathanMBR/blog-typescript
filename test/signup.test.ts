// Modules
import supertest, { Response as SuperTestResponse } from "supertest";
import app from "../src/instance/app";
import connection from "../src/database/connection";

// Instance
const request = supertest(app);

// Test users
type UserSignupFormData = string | undefined;

interface UserSignup {
    name: UserSignupFormData;
    email: UserSignupFormData;
    password: UserSignupFormData;
    confirmEmail?: UserSignupFormData;
    confirmPassword?: UserSignupFormData;
}

const successUser: UserSignup = {
    name: "Success User",
    email: "success@user.com",
    password: "success8"
};

const repeatedUser: UserSignup = {
    name: "Repeated User",
    email: "repeated@user.com",
    password: "repeated"
}

// Requests
const signup = async (
    name: UserSignupFormData,
    email: UserSignupFormData,
    password: UserSignupFormData,
    confirmEmail: UserSignupFormData = email,
    confirmPassword: UserSignupFormData = password
) => new Promise<SuperTestResponse>(async (resolve: Function, reject: Function) => {
    const user: UserSignup = {
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
        reject(error as string);
    }
});

// Jest globals
beforeAll(async () => {
    const { name, email, password } = repeatedUser;

    try {
        await connection.insert({
            name,
            email,
            password,
            profile_picture: null,
            slug: "a"
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
describe("User creation tests", () => {
    it("Should successfully register the account and return 201", async () => {
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

    it("Should not register a name that is invalid", async () => {
        try {
            const response = await signup(
                "",
                "test1@gmail.com",
                "12345678"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register a name that matches with not allowed characters", async () => {
        try {
            const response = await signup(
                "Test-2",
                "test2@gmail.com",
                "12345678"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register a name that has less than three characters", async () => {
        try {
            const response = await signup(
                "Te",
                "test3@gmail.com",
                "12345678"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register an e-mail that is invalid", async () => {
        try {
            const response = await signup(
                "Test 4",
                "",
                "12345678"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register with different e-mails", async () => {
        try {
            const response = await signup(
                "Test 5",
                "test5A@gmail.com",
                "12345678",
                "test5B@gmail.com"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register an already registered account", async () => {
        const { name, email, password } = repeatedUser;
        try {
            const response = await signup(
                name,
                email,
                password
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register with a password that is invalid", async () => {
        try {
            const response = await signup(
                "Test 7",
                "test7@gmail.com",
                ""
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register with a password that has less than eight characters", async () => {
        try {
            const response = await signup(
                "Test 8",
                "test8@gmail.com",
                "12345"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });

    it("Should not register with different passwords", async () => {
        try {
            const response = await signup(
                "Test 9",
                "test9@gmail.com",
                "A-12345678",
                undefined,
                "B-12345678"
            );
            expect(response.statusCode).toBe(400);
        } catch (error) {
            throw new Error(error as string);
        }
    });
});