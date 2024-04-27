import productModel from "./product-model";
import { Product } from "./product-type";

export class ProductService {
    async create(product: Product) {
        const newProduct = new productModel(product);

        return newProduct.save();
    }
}
