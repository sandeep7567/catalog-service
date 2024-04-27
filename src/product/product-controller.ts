import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import {
    Attribute,
    CreateProductRequest,
    PriceConfiguration,
} from "./product-type";
import { ProductService } from "./product-service";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {}

    create = async (
        req: CreateProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { name, description, tenantId, categoryId, isPublish } = req.body;

        const priceConfiguration = JSON.parse(
            req.body.priceConfiguration as string,
        ) as PriceConfiguration;
        const attributes = JSON.parse(
            req.body.attributes as string,
        ) as Attribute[];

        const product = {
            name,
            description,
            tenantId,
            categoryId,
            attributes: attributes,
            priceConfiguration,
            isPublish,
            image: "image.png",
        };

        const newProduct = await this.productService.create(product);

        this.logger.info(`Product created with ${newProduct.name}`);

        res.json({ id: newProduct._id });
    };
}
