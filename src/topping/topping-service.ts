import { Filter } from "../product/product-type";
import toppingModel from "./topping-model";
import { Topping } from "./topping-type";

export class ToppingService {
    async createTopping(topping: Topping): Promise<Topping | null> {
        const newTopping = new toppingModel(topping);

        return newTopping.save();
    }

    async getTopping(toppingId: string): Promise<Topping | null> {
        return (await toppingModel.findById(toppingId)) as Topping;
    }

    async updateTopping(
        toppingId: string,
        topping: Topping,
    ): Promise<Topping | null> {
        return (await toppingModel.findByIdAndUpdate(
            toppingId,
            { $set: topping },
            {
                new: true,
            },
        )) as Topping;
    }

    async getToppings(filters: Filter): Promise<Topping[] | null> {
        // const { tenantId } = filters;
        const matchQuery = {
            ...filters,
        };

        return await toppingModel.find(matchQuery);
    }

    async deleteById(toppingId: string): Promise<Topping | null> {
        return (await toppingModel.findByIdAndDelete(toppingId)) as Topping;
    }
}
