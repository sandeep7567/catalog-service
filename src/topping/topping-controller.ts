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

        res.json({ id: newTopping?._id });
    };
}
