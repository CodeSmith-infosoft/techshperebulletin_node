import { categoryModel } from "../models/categoryModel.js";

export class categoryService {
    static async categoryExists(data) {
        try {
            const categoryExists = await categoryModel.findOne(data);
            return (categoryExists);
        } catch (error) {
            return (error);
        };
    };

    static async createCategory(data) {
        try {
            const createNewCategory = await categoryModel.create({
                ...data
            });
            return (createNewCategory);
        } catch (error) {
            return (error);
        };
    };

    static async getAllCategory({ filter, skip, limit }) {
        try {
            if (typeof skip === 'number' && typeof limit === 'number') {
                const totalRecords = await categoryModel.countDocuments(filter);
                const records = await categoryModel
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                return { records, totalRecords };
            };
            return await categoryModel.find(filter).sort({ createdAt: -1 });
        } catch (error) {
            return (error);
        };
    };

    static async updateCategory(data) {
        try {
            const updateCategory = await categoryModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateCategory);
        } catch (error) {
            return (error);
        };
    };
};