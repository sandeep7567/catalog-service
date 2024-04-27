import CategoryModal from "./category-modal";
import { Category } from "./category-type";

export class CategoryService {
    async create(category: Category) {
        const newCategory = new CategoryModal(category);

        return newCategory.save();
    }
}
