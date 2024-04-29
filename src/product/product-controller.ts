import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import {
    Attribute,
    CreateProductRequest,
    Filter,
    PriceConfiguration,
    Product,
} from "./product-type";
import { ProductService } from "./product-service";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import { FileStorage } from "../common/types/storage";
import { UploadApiResponse } from "cloudinary";
import { AuthRequest } from "../category/category-type";
import { Roles } from "../common/constant";
import mongoose from "mongoose";

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
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

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        const imageResult = (await this.storage.upload({
            fileData: image.data.buffer,
            filename: imageName,
            fileMimeType: image.mimetype,
        })) as UploadApiResponse;

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
            attributes,
            priceConfiguration,
            isPublish,
            image: imageResult.public_id,
        };

        const newProduct = await this.productService.createProduct(product);

        if (!newProduct) {
            return next(createHttpError(404, "Product not found"));
        }

        this.logger.info(`Product created with ${newProduct.name}`);

        res.json({ id: newProduct._id });
    };

    update = async (
        req: CreateProductRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { productId } = req.params;

        const existingProduct = await this.productService.getProduct(productId);

        if (!existingProduct) {
            return next(createHttpError(404, "Product not found"));
        }

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            const tenant = (req as AuthRequest).auth.tenant;

            if (existingProduct.tenantId !== tenant) {
                return next(createHttpError(403, "Forbidden for this product"));
            }
        }

        let newImage: string | undefined;
        let oldImage: string | undefined;

        if (req.files?.image) {
            oldImage = existingProduct.image;

            const image = req.files.image as UploadedFile;
            const imageName = uuidv4();

            const imageRes = (await this.storage.upload({
                fileData: image.data,
                filename: imageName,
                fileMimeType: image.mimetype,
            })) as UploadApiResponse;

            if (oldImage && imageRes?.public_id) {
                newImage = imageRes.public_id;

                await this.storage.delete(oldImage);
            }
        }

        oldImage = existingProduct.image;

        const { name, description, tenantId, categoryId, isPublish } = req.body;

        const priceConfiguration = JSON.parse(
            req.body.priceConfiguration as string,
        ) as PriceConfiguration;
        const attributes = JSON.parse(
            req.body.attributes as string,
        ) as Attribute[];

        const productToUpdate = {
            name,
            description,
            tenantId,
            categoryId,
            attributes,
            priceConfiguration,
            isPublish,
            image: newImage ? newImage : oldImage,
        };

        await this.productService.updateProduct(productId, productToUpdate);

        this.logger.info(`Product created with ${productToUpdate.name}`);

        res.json({ id: existingProduct._id });
    };

    getAll = async (req: Request, res: Response) => {
        const { q, tenantId, categoryId, isPublish } = req.query;

        const filters: Filter = {};

        if (isPublish === "true") {
            filters.isPublish = true;
        }

        if (tenantId) filters.tenantId = String(tenantId);

        if (categoryId && mongoose.Types.ObjectId.isValid(String(categoryId))) {
            filters.categoryId = new mongoose.Types.ObjectId(
                String(categoryId),
            );
        }

        const products = await this.productService.getProducts(
            q as string,
            filters,
            {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit
                    ? parseInt(req.query.limit as string)
                    : 10,
            },
        );

        const finalProducts = await Promise.all(
            (products.data as Product[]).map(async (product: Product) => {
                const image = await this.storage.getObjectUri(
                    product?.image as string,
                );
                return {
                    ...product,
                    image,
                };
            }),
        );

        this.logger.info(`Getting product list`);
        res.json({
            data: finalProducts,
            total: products.total,
            pageSize: products.pageSize,
            currentPage: products.page,
        });
    };

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;

        const product = await this.productService.getProduct(productId);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        const image = await this.storage.getObjectUri(product.image as string);

        product.image = image;

        res.json(product);
    };

    destroy = async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const { role, tenant } = (req as AuthRequest).auth;

        const existingProduct = await this.productService.getProduct(productId);

        if (!existingProduct) {
            return next(createHttpError(404, "Product does not exist"));
        }

        if (role !== Roles.ADMIN) {
            if (existingProduct.tenantId !== tenant) {
                return next(createHttpError(403, "Forbidden for this product"));
            }
        }

        const product = await this.productService.deleteById(productId);
        await this.storage.delete(`${product.image}`);

        res.json({ id: productId });
    };
}
