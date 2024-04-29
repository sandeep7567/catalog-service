import { Request } from "express";
import mongoose from "mongoose";

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    value: string | number;
}

export interface Product {
    name: string;
    description: string;
    image?: string;
    tenantId: string;
    categoryId: mongoose.Schema.Types.ObjectId;
    isPublish?: boolean;
    priceConfiguration: PriceConfiguration | string;
    attributes: Attribute[] | string;
}
export interface CreateProductRequest extends Request {
    body: Product;
}
export interface Filter {
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean;
}
