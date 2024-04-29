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
        this.getOne = this.getOne.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
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

    async getAll(req: Request, res: Response) {
        const categories = await this.categoryService.getAll();
        this.logger.info(`Getting categories list`);
        res.json(categories);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params;

        if (!categoryId) {
            return next(createHttpError(404, "Category not found"));
        }

        const category = await this.categoryService.getById(categoryId);

        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }

        this.logger.info(`Getting category`, { id: category._id });
        res.json(category);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params;

        if (!categoryId) {
            return next(createHttpError(404, "Category not found"));
        }

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { name, attributes, priceConfiguration } = req.body as Category;

        const category = await this.categoryService.update(
            {
                name,
                attributes,
                priceConfiguration,
            },
            categoryId,
        );

        this.logger.info(`Category updated successfully`, {
            id: category?._id,
        });

        res.json({ id: category?._id });
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params;

        if (!categoryId) {
            return next(createHttpError(404, "Category not found"));
        }

        await this.categoryService.deleteById(categoryId);

        this.logger.info(`Category deleted successfully`, { id: categoryId });
        res.json({ id: categoryId });
    }
}
