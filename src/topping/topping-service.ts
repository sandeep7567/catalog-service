import toppingModel from "./topping-model";
import { Topping } from "./topping-type";

export class ToppingService {
    async createTopping(topping: Topping): Promise<Topping | null> {
        const newTopping = new toppingModel(topping);

        return newTopping.save();
    }
}
