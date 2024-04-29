import { UploadApiResponse } from "cloudinary";

export interface CloudinaryResourceUrlResponse {
    public_id: string;
    secure_url: string;
    format: string;
    asset_id: string;
    resource_type: string;
    type: string;
    bytes: number;
    width: number;
    height: number;
}

export interface DestoryCloudImage {
    result: string;
}

export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
    fileMimeType?: string;
}

export interface FileStorage {
    upload(data: FileData): Promise<void | UploadApiResponse>;
    delete(filename: string): Promise<DestoryCloudImage>;
    getObjectUri(filename: string): Promise<string>;
}
