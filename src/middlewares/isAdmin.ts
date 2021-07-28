// Modules
import { Request, Response, NextFunction } from "express";

// Middleware
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { is_admin } = JSON.parse(req.headers.user as string);

    if (is_admin)
        next();
    else
        res.status(401).send({errors: [
            "You must be an administrator to access this route."
        ]});
}

// Export
export default isAdmin;