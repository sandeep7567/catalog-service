import { UploadApiResponse } from "cloudinary";

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
    getObjectUri(filename: string): string;
}
