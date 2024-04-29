import express, { Response } from "express";
import fileUpload from "express-fileupload";
import { Request } from "express-jwt";
import createHttpError from "http-errors";
import { Roles } from "../common/constant";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import createToppingValidator from "./create-topping-validator";

const router = express.Router();

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fieldSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    createToppingValidator,

    async (req: Request, res: Response) => {
        res.json(req.body);
    },
);

export default router;
