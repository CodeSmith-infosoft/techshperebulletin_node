import { newsModel } from "../models/newsModel.js";

export class newsService {
    static async createNews(data) {
        try {
            const createNewNews = await newsModel.create({
                ...data
            });
            return (createNewNews);
        } catch (error) {
            return (error);
        };
    };

    static async getAllNews({ isActive, isDelete, categoryName, latestNews, tagName, skip, limit }) {
        try {
            const matchStage = {};
            if (typeof isActive === 'boolean') matchStage.isActive = isActive;
            if (typeof isDelete === 'boolean') matchStage.isDelete = isDelete;

            if (latestNews === 'true') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                matchStage.createdAt = { $gte: sevenDaysAgo };
            };

            const basePipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'categoryId',
                    },
                },
                { $unwind: '$categoryId' },
                {
                    $lookup: {
                        from: 'tags',
                        localField: 'tagId',
                        foreignField: '_id',
                        as: 'tagId',
                    },
                },
                { $unwind: '$tagId' },
                ...(categoryName ? [{ $match: { 'categoryId.name': categoryName } }] : []),
                ...(tagName ? [{ $match: { 'tagId.name': tagName } }] : []),
            ];
            const countPipeline = [...basePipeline, { $count: 'total' }];
            const countResult = await newsModel.aggregate(countPipeline);
            const totalRecords = countResult[0]?.total || 0;
            const paginatedPipeline = [
                ...basePipeline,
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ];
            const records = await newsModel.aggregate(paginatedPipeline);
            return { records, totalRecords };
        } catch (error) {
            return (error);
        };
    };

    static async newsExists(data) {
        try {
            const getNews = await newsModel.findOne(data).populate('categoryId').populate('tagId');
            return (getNews);
        } catch (error) {
            return (error);
        };
    };

    static async updateNews(data) {
        try {
            const updateNews = await newsModel.findByIdAndUpdate(
                { _id: data.id },
                { $set: data },
                { new: false, runValidators: true }
            );
            return (updateNews);
        } catch (error) {
            return (error);
        };
    };
};
