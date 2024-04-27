import mongoose from "mongoose";
import { Product, PriceConfiguration, Attribute } from "./product-type";

const attributeValueSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base", "additional"],
    },
    availableOptions: {
        type: Map,
        of: Number,
        required: true,
    },
});

const productSchema = new mongoose.Schema<Product>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        // Map is used to store multiple dynamic data in form of key:value { [key:string]: value, [key:string]: value,  }
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSchema, // value
            required: true,
        },
        attributes: [attributeValueSchema],
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        isPublish: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Product", productSchema);
