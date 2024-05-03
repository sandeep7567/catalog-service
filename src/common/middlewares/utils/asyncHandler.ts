import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import { CloudinaryError } from "./../../types/error";

export const asyncHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                return next(createHttpError(500, err.message));
            } else if ((err as CloudinaryError).error.http_code === 420) {
                return next(
                    createHttpError(
                        420,
                        `cloudinary error: ${
                            (err as CloudinaryError).error.message
                        }`,
                    ),
                );
            } else {
                return next(createHttpError(500, "Internal server error"));
            }
        });
    };
};
