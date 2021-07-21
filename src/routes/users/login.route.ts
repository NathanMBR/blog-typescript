// Modules
import { Request, Response, Router } from "express";
const router = Router();
import connection from "../../database/connection";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

// Settings
import { usersLengths } from "../../settings/lengths";
import secret from "../../settings/secret";
import tokenExpiration from "../../settings/tokenExpiration";

// Routes
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const errors: Array<string> = [];

    // Validations
    // E-mail
    if (!email)
        errors.push("The e-mail can't be undefined.");
    else if (typeof email !== "string")
        errors.push("The e-mail must be a string.");
    else {
        if (email.length < usersLengths.email.min)
            errors.push(`The e-mail is too short (must have at least ${usersLengths.email.min} characters).`);
        else
            if (email.length > usersLengths.email.max)
                errors.push(`The e-mail is too long (must have a maximum of ${usersLengths.email.max} characters).`);
    }
    
    // Password
    if (!password)
        errors.push("The password can't be undefined.");
    else if (typeof password !== "string")
        errors.push("The password must be a string.");
    else {
        if (password.length < usersLengths.password.min)
            errors.push(`The password is too short (must have at least ${usersLengths.password.min} characters).`);
        else
            if (password.length > usersLengths.password.max)
                errors.push(`The password is too long (must have a maximum of ${usersLengths.password.max} characters).`);
    }

    try {
        // Asynchronous validations
        const doesEmailExist = (await connection.select()
            .where({email})
            .table("users"))[0];
        
        if (!doesEmailExist)
            errors.push("Incorrect e-mail or password.");
        else {
            const doesPasswordsMatch = await compare(password, doesEmailExist.password);
            if (!doesPasswordsMatch)
                errors.push("Incorrect e-mail or password.");
        }

        // Error checking
        if (errors.length === 0) {
            const { id, is_admin } = doesEmailExist;

            // User authentication
            sign({id, email, is_admin}, secret, {expiresIn: tokenExpiration, algorithm: "HS512"}, (error: Error | null, token: string | undefined) => {
                if (error)
                    throw new Error(error as unknown as string); // Damn JS, was It hard to accept "any" and convert into a string?
                else
                    res.json({token});
            });
        } else 
            res.status(400).json({errors});
    } catch (error) {
        console.error(error as string);
        res.sendStatus(500);
    }
});

// Export
export { router };