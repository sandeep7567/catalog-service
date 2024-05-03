import { paginationLabels } from "../config/pagination";
import productModel from "./product-model";
import { Filter, PaginateQuery, Product } from "./product-type";

export class ProductService {
    async createProduct(product: Product): Promise<Product | null> {
        const newProduct = new productModel(product);

        return newProduct.save();
    }

    async getProduct(productId: string): Promise<Product | null> {
        return (await productModel.findById(productId)) as Product;
    }

    async updateProduct(
        productId: string,
        product: Product,
    ): Promise<null | Product> {
        return (await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: product },
            { new: true },
        )) as Product;
    }

    async getProducts(
        q: string,
        filters: Filter,
        paginateQuery: PaginateQuery,
    ) {
        const searchQueryRegexp = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        return await productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels,
        });
    }

    async deleteById(productId: string) {
        return (await productModel.findByIdAndDelete(productId)) as Product;
    }
}
