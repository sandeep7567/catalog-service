import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category } from "./category-type";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { name, attributes, priceConfiguration } = req.body as Category;

        const category = await this.categoryService.create({
            name,
            attributes,
            priceConfiguration,
        });

        this.logger.info(`Category ${name} created successfully`, {
            id: category._id,
        });

        res.json({ id: category._id });
    }
}
