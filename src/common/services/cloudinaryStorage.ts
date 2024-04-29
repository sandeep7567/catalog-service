import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "config";
import {
    CloudinaryResourceUrlResponse,
    DestoryCloudImage,
    FileData,
    FileStorage,
} from "../types/storage";

export class CloudinaryStorage implements FileStorage {
    constructor() {
        cloudinary.config({
            cloud_name: config.get("cloudinary.cloud_name"),
            api_key: config.get("cloudinary.api_key"),
            api_secret: config.get("cloudinary.api_secret"),
            secure: true,
        });
    }

    async upload(data: FileData): Promise<void | UploadApiResponse> {
        const b64String = Buffer.from(data.fileData).toString("base64");
        const dataURI = "data:" + data.fileMimeType + ";base64," + b64String;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            public_id: data.filename,
            folder: "catalog",
        };

        return await cloudinary.uploader.upload(dataURI, {
            ...options,
            resource_type: "image",
        });
    }

    async delete(filename: string): Promise<DestoryCloudImage> {
        return (await cloudinary.uploader.destroy(filename, {
            resource_type: "image",
        })) as DestoryCloudImage;
    }

    async getObjectUri(filename: string): Promise<string> {
        const result = (await cloudinary.api.resource(
            filename,
        )) as CloudinaryResourceUrlResponse;
        return result.secure_url;
    }
}
