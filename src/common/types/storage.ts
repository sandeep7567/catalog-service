import { UploadApiResponse } from "cloudinary";

export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
    fileMimeType?: string;
}

export interface FileStorage {
    upload(data: FileData): Promise<void | UploadApiResponse>;
    delete(filename: string): Promise<void>;
    getObjectUri(filename: string): string;
}
