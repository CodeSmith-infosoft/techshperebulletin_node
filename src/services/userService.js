import { userModel } from "../models/userModel.js";

export class userService {
    static async userExists(data) {
        try {
            const userExists = await userModel.findOne(data).populate('subscribedCats');
            return (userExists);
        } catch (error) {
            return (error);
        };
    };

    static async createUser(data) {
        try {
            const createNewUser = await userModel.create({
                ...data
            });
            return (createNewUser);
        } catch (error) {
            return (error);
        };
    };

    static async updateUser(data) {
        try {
            const updateUser = await userModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateUser);
        } catch (error) {
            return (error);
        };
    };

    static async countUsers() {
        try {
            return await userModel.countDocuments();
        } catch (error) {
            return (error);
        };
    };

    static async getUsers(skip, limit) {
        try {
            const users = await userModel.find().select("-password").populate('subscribedCats').sort({ createdAt: -1 }).skip(skip).limit(limit);
            return (users);
        } catch (error) {
            return (error);
        };
    };
};
