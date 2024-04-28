import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { FileData, FileStorage } from "../types/storage";
import config from "config";

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

        return await cloudinary.uploader.upload(dataURI, {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            public_id: data.filename,
            folder: "catalog",
            resource_type: "image",
        });
    }

    async delete(): Promise<void> {}

    getObjectUri(filename: string): string {
        return filename;
    }
}
