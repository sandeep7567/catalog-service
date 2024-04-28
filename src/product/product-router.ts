import express from "express";
import { Roles } from "../common/constant";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { asyncHandler } from "../common/middlewares/utils/asyncHandler";
import logger from "../config/logger";
import createProductValidator from "./create-product-validator";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import { CloudinaryStorage } from "../common/services/cloudinaryStorage";

const router = express.Router();

const productService = new ProductService();
const storage = new CloudinaryStorage();
const productController = new ProductController(
    productService,
    storage,
    logger,
);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    createProductValidator,
    asyncHandler(productController.create),
);

export default router;
