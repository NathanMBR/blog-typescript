// Modules
import express, { Request, Response } from "express";
const router = express.Router();
import connection from "../../database/connection";
import { hashSync, genSaltSync } from "bcryptjs";
import slugify from "slugify";

// Settings and Types
import { usersLengths } from "../../settings/lengths";
import { UsersTable } from "../../database/tablesTypes";

// Routes
router.post("/signup", async (req: Request, res: Response) => {
    const { name, email, confirmEmail, password, confirmPassword } = req.body;
    const errors: Array<string> = [];

    // Validations
    const regex = /[^a-zA-Z\d\s]/g;

    // Name
    if (!name)
        errors.push("The name can't be undefined.");
    else if (typeof name !== "string")
        errors.push("The name must be a string.");
    else {
        if (name.length < usersLengths.name.min)
            errors.push(`The name is too short (must have at least ${usersLengths.name.min} characters).`);
        else
            if (name.length > usersLengths.name.max)
                errors.push(`The name is too long (must have a maximum of ${usersLengths.name.max} characters).`);
        
        if (name.match(regex))
            errors.push("The name must have only alphanumerical characters and spaces.");
    }

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

    if (!confirmEmail)
        errors.push("The e-mail confirmation can't be undefined.");
    else if (typeof confirmEmail !== "string")
        errors.push("The e-mail confirmation must be a string.");
    else
        if (email !== confirmEmail)
            errors.push("The e-mails aren't equal.");

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

    if (!confirmPassword)
        errors.push("The password confirmation can't be undefined.");
    else if (typeof confirmPassword !== "string")
        errors.push("The password confirmation must be a string.");
    else
        if (password !== confirmPassword)
            errors.push("The passwords aren't equal.");

    try {
        // Asynchronous validations
        const repeatedName = await connection.select()
            .where({slug: slugify(name, {lower: true})})
            .table("users");
        if (repeatedName[0])
            errors.push("The name is already in use.");

        const repeatedEmail = await connection.select()
            .where({email})
            .table("users");
        if (repeatedEmail[0])
            errors.push("The e-mail is already in use.");

        if (errors.length === 0) {
            const user: UsersTable = {
                name,
                email,
                password: hashSync(password, genSaltSync(usersLengths.password.max)),
                profile_picture: null,
                slug: slugify(name, {lower: true})
            }

            await connection.insert(user)
                .into("users");
            
            res.sendStatus(201);
        } else
            res.status(400).json({errors});
    } catch (error: any) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Export
export { router };