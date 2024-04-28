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
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";
import { FileStorage } from "../common/types/storage";
import { UploadApiResponse } from "cloudinary";

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
}
