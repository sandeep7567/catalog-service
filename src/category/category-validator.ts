import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Category name is required")
        .isString()
        .withMessage("Category name should be a string"),
    body("priceConfiguration")
        .exists()
        .withMessage("priceConfiguration is required"),
    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("priceConfiguration price type is required")
        .custom((value: "base" | "additional") => {
            const validKeys = ["base", "additional"];
            if (!validKeys.includes(value)) {
                throw new Error(
                    `${value} is invalid, possible values are [${validKeys.join(
                        ",",
                    )}]`,
                );
            }
        }),
    body("attributes").exists().withMessage("attributes is required"),
];
