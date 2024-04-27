import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../category/category-type";
import createHttpError from "http-errors";

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            const err = createHttpError(
                403,
                "do not have permission to access this resources",
            );

            next(err);
        }

        next();
    };
};
