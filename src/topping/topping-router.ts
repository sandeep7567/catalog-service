import express from "express";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { Roles } from "../common/constant";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { asyncHandler } from "../common/middlewares/utils/asyncHandler";
import logger from "../config/logger";
import { CloudinaryStorage } from "./../common/services/cloudinaryStorage";
import createToppingValidator from "./create-topping-validator";
import { ToppingController } from "./topping-controller";
import { ToppingService } from "./topping-service";

const router = express.Router();

const toppingService = new ToppingService();
const cloudinaryStorage = new CloudinaryStorage();
const toppingController = new ToppingController(
    toppingService,
    cloudinaryStorage,
    logger,
);

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
    asyncHandler(toppingController.create),
);

export default router;
