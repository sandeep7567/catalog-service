import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { ToppingService } from "./topping-service";
import { CreateToppingRequest } from "./topping-type";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadApiResponse } from "cloudinary";
import { AuthRequest } from "../category/category-type";
import { Roles } from "../common/constant";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private storage: FileStorage,
        private logger: Logger,
    ) {}

    create = async (
        req: CreateToppingRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { name, price, tenantId } = req.body;

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        const imageResult = (await this.storage.upload({
            fileData: image.data,
            filename: imageName,
            fileMimeType: image.mimetype,
        })) as UploadApiResponse;

        const topping = {
            name,
            price,
            tenantId,
            image: imageResult.public_id,
        };

        const newTopping = await this.toppingService.createTopping(topping);

        if (!newTopping) {
            return next(createHttpError(404, "Not Found"));
        }

        this.logger.info("Topping created successfully", {
            id: newTopping?._id,
        });

        res.status(201).json({ id: newTopping?._id });
    };

    update = async (
        req: CreateToppingRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(result.array()[0].msg));
        }

        const { toppingId } = req.params;

        const existingTopping = await this.toppingService.getTopping(toppingId);

        if (!existingTopping) {
            return next(createHttpError(404, "Topping not found"));
        }

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            const tenant = (req as AuthRequest).auth.tenant;

            if (existingTopping.tenantId !== tenant) {
                return next(createHttpError(403, "Forbidden for this topping"));
            }
        }

        let newImage: string | undefined;
        let oldImage: string | undefined;

        if (req.files?.image) {
            oldImage = existingTopping.image;

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

        oldImage = existingTopping.image;

        const { name, tenantId, price } = req.body;

        const toppingToUpdate = {
            name,
            tenantId,
            price,
            image: newImage ? newImage : oldImage,
        };

        await this.toppingService.updateTopping(toppingId, toppingToUpdate);

        this.logger.info(`Product created with ${toppingToUpdate.name}`);

        res.json({ id: existingTopping._id });
    };
}
