import { Request } from "express";
import mongoose from "mongoose";

export interface Topping {
    _id?: mongoose.Types.ObjectId;
    name: string;
    price: number;
    image?: string;
    tenantId: string;
}
export interface CreateToppingRequest extends Request {
    body: Topping;
}

export interface Filter {
    tenantId?: string;
    price: number;
}

export interface PaginateQuery {
    page: number;
    limit: number;
}
