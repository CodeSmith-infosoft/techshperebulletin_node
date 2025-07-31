import { contactModel } from "../models/contactModel.js";

export class tagsService {
    static async addContactUs(data) {
        try {
            const createNewUser = await contactModel.create({
                ...data
            });
            return (createNewUser);
        } catch (error) {
            return (error);
        };
    };

    static async getAllContactUsCount(filter = {}) {
        try {
            const tagCount = await contactModel.countDocuments(filter);
            return (tagCount);
        } catch (error) {
            return (error);
        };
    };

    static async getAllContactUs(filter = {}, skip, limit) {
        try {
            const query = contactModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
            return await (query);
        } catch (error) {
            return (error);
        };
    };

    static async updateTags(data) {
        try {
            const updateTags = await contactModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateTags);
        } catch (error) {
            return (error);
        };
    };
};
