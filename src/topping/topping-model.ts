import mongoose from "mongoose";
import { Topping } from "./topping-type";

const toppingSchema = new mongoose.Schema<Topping>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<Topping>("Topping", toppingSchema);
