import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Topping name is required")
        .isString()
        .withMessage("It should be a string"),
    body("price")
        .exists()
        .withMessage("Topping price is required")
        .customSanitizer((value): number => {
            // console.log(value, typeof value === "number");
            if (!(typeof value === "number")) {
                if (!isNaN(Number(value))) {
                    return Number(value);
                } else {
                    throw new Error("Invalid number");
                }
            }

            return value;
        }),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("Topping image is required");
        return true;
    }),
    body("tenantId").exists().withMessage("Tenant id is required"),
];
