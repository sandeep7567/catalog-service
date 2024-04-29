import categoryModel from "./category-model";
import { Category } from "./category-type";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new categoryModel(category);

        return newCategory.save();
    }

    async getAll() {
        return await categoryModel.find();
    }

    async getById(categoryId: string) {
        return await categoryModel.findById(categoryId);
    }

    async update(category: Category, categoryId: string) {
        return await categoryModel.findByIdAndUpdate(
            categoryId,
            {
                $set: {
                    name: category.name,
                    attributes: category.attributes,
                    priceConfiguration: category.priceConfiguration,
                },
            },
            { new: true },
        );
    }

    async deleteById(categoryId: string) {
        return (await categoryModel.findByIdAndDelete(categoryId)) as Category;
    }
}
