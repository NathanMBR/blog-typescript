// Modules
import { Request, Response, NextFunction } from "express";
import { verify, VerifyErrors, JwtPayload } from "jsonwebtoken";
import secret from "../settings/secret";

// Middleware
const isLogged = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization)
        res.status(401).json({errors: [
            "You must be logged in to access this route."
        ]});
    else if (typeof authorization !== "string")
        res.status(400).json({errors: [
            "Invalid JWT token."
        ]});
    else 
        verify(authorization.split(" ")[1], secret, (error: VerifyErrors | null, data: JwtPayload | undefined) => {
            if (error)
                res.status(401).send({errors: [error]});
            else {
                req.headers.user = JSON.stringify(data);
                next();
            }
        });
}

// Export
export default isLogged;