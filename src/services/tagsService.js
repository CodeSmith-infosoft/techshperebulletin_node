import { tagsModel } from "../models/tagsModel.js";

export class tagsService {
    static async tagsExists(data) {
        try {
            const categoryExists = await tagsModel.findOne(data).populate('categoryId');
            return (categoryExists);
        } catch (error) {
            return (error);
        };
    };

    static async createTag(data) {
        try {
            const createNewUser = await tagsModel.create({
                ...data
            });
            return (createNewUser);
        } catch (error) {
            return (error);
        };
    };

    static async countTags(filter = {}) {
        try {
            const tagCount = await tagsModel.countDocuments(filter);
            return (tagCount);
        } catch (error) {
            return (error);
        };
    };

    static async getAllTags(filter = {}, skip, limit) {
        try {
            const query = tagsModel.find(filter).populate('categoryId').sort({ createdAt: -1 });
            if (limit > 0) query.skip(skip).limit(limit);
            return await (query);
        } catch (error) {
            return (error);
        };
    };

    static async updateTags(data) {
        try {
            const updateTags = await tagsModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateTags);
        } catch (error) {
            return (error);
        };
    };
    static async getTagsByCategoryId(categoryId) {
    try {
        const tags = await tagsModel.find({ categoryId, isActive: true });
        return tags;
    } catch (error) {
        return error;
    }
}
};
