import { blogModel } from "../models/blogModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";

export class blogService {
    static async blogExists(data) {
        try {
            const categoryExists = await blogModel.findOne(data);
            return (categoryExists);
        } catch (error) {
            return (error);
        };
    };

    static async createBlog(data) {
        try {
            const createNewBlog = await blogModel.create({
                ...data
            });
            return (createNewBlog);
        } catch (error) {
            return (error);
        };
    };

    static async getAllBlog({ filter, skip, limit }) {
        try {
            const totalRecords = await blogModel.countDocuments(filter);
            const records = await blogModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return { records, totalRecords };
        } catch (error) {
            return (error);
        };
    };

    static async updateBlogById(data) {
        try {
            const updateBlog = await blogModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateBlog);
        } catch (error) {
            return (error);
        };
    };
};
