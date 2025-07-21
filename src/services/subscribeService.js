import { subscribeModel } from "../models/subscribeModel.js";

export class subscribeService {
    static async getSubscribedCategoryList(data) {
        console.log("data", data)
        try {
            const subscribedCategories = await subscribeModel.find({ userId: data?.id }).populate('categoryId');
            return (subscribedCategories);
        } catch (error) {
            return (error);
        };
    };
};
