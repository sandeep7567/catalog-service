import toppingModel from "./topping-model";
import { Topping } from "./topping-type";

export class ToppingService {
    async createTopping(topping: Topping): Promise<Topping | null> {
        const newTopping = new toppingModel(topping);

        return newTopping.save();
    }

    async getTopping(toppingId: string): Promise<Topping | null> {
        return await toppingModel.findById(toppingId);
    }

    async updateTopping(
        toppingId: string,
        topping: Topping,
    ): Promise<Topping | null> {
        return await toppingModel.findByIdAndUpdate(
            toppingId,
            { $set: topping },
            {
                new: true,
            },
        );
    }

    async getToppings(): Promise<Topping[]> {
        return await toppingModel.find();
    }
}
