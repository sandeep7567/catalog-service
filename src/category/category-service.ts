import CategoryModal from "./category-modal";
import { Category } from "./category-type";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModal(category);

        return newCategory.save();
    }

    async getAll() {
        return await CategoryModal.find();
    }

    async getById(categoryId: string) {
        return await CategoryModal.findById(categoryId);
    }

    async update(category: Category, categoryId: string) {
        return await CategoryModal.findByIdAndUpdate(
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
}
