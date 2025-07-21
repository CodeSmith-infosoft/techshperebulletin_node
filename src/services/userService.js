import { userModel } from "../models/userModel.js";
import { dbTableName } from "../utils/constants.js"

export class userService {
    static async userExists(data) {
        try {
            const userExists = await userModel.findOne(data);
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
        console.log(data)
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

    // static async getUsers() {
    //     try {
    //         const userExists = await userModel.find().select("-password").sort({ createdAt: -1 });
    //         return (userExists);
    //     } catch (error) {
    //         return (error);
    //     };
    // };
    static async getUsers() {
        try {
            const users = await userModel.aggregate([
                {
                    $lookup: {
                        from: dbTableName.SUBSCRIBE,
                        localField: "_id",
                        foreignField: "userId",
                        as: "subscriptions"
                    }
                },
                {
                    $unwind: {
                        path: "$subscriptions",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: dbTableName.CATEGORY,
                        localField: "subscriptions.categoryId",
                        foreignField: "_id",
                        as: "subscriptions.category"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        isActive: { $first: "$isActive" },
                        createdAt: { $first: "$createdAt" },
                        categories: { $push: { $arrayElemAt: ["$subscriptions.category", 0] } }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);
            return (users);
        } catch (error) {
            console.error("Error in getUsersWithCategories:", error);
            return (error);
        };
    };

    static async getGoogleOAuthUrl(data) {
        try {
            let createNewUser = await userModel.findOne({ email: user.email })

            return (updateUser);
        } catch (error) {
            return (error);
        };
    };
};
