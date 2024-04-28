import productModel from "./product-model";
import { Product } from "./product-type";

export class ProductService {
    async create(product: Product) {
        const newProduct = new productModel(product);

        return newProduct.save();
    }

    async getProduct(productId: string) {
        return await productModel.findById(productId);
    }

    async updateProduct(productId: string, product: Product) {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            { new: true },
        )) as Product;
    }
}
