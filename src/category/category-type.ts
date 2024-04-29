import { Request } from "express";

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenant: string;
    };
}
