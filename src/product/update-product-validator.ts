import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),
    body("description")
        .exists()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description should be a string"),
    body("priceConfiguration")
        .exists()
        .withMessage("Price configuration is required"),
    body("attributes").exists().withMessage("attributes is required"),
    body("tenantId").exists().withMessage("Tenant id is required"),
    body("categoryId").exists().withMessage("Category id is required"),
];
