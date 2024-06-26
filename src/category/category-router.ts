import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import { asyncHandler } from "../common/middlewares/utils/asyncHandler";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constant";

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncHandler(categoryController.create),
);

router.get("/", asyncHandler(categoryController.getAll));
router.get("/:categoryId", asyncHandler(categoryController.getOne));

router.patch(
    "/:categoryId",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncHandler(categoryController.update),
);

router.delete(
    "/:categoryId",
    authenticate,
    canAccess([Roles.ADMIN]),
    asyncHandler(categoryController.destroy),
);

export default router;
