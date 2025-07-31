import { newsModel } from "../models/newsModel.js";

export class newsService {
    static async createNews(data) {
        console.log('data',data);
        try {
            const createNewNews = await newsModel.create({
                ...data
            });
            return (createNewNews);
        } catch (error) {
            return (error);
        };
    };

    static async getAllNews({ isActive, isDelete, categoryName, latestNews, tagName, isPromoted, skip = 0, limit = 10 }) {
        try {
            if (isPromoted === 'true') isPromoted = true;
            if (isPromoted === 'false') isPromoted = false;
            if (isActive === 'true') isActive = true;
            if (isActive === 'false') isActive = false;
            if (isDelete === 'true') isDelete = true;
            if (isDelete === 'false') isDelete = false;
            const matchStage = {};
            if (typeof isActive === 'boolean') matchStage.isActive = isActive;
            if (typeof isDelete === 'boolean') matchStage.isDelete = isDelete;
            if (typeof isPromoted === 'boolean') matchStage.isPromoted = isPromoted;
            if (latestNews === 'true') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                matchStage.createdAt = { $gte: sevenDaysAgo };
            }
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
            return error;
        };
    };

    static async getAllHomeNews() {
        try {
            const pipeline = [
                {
                    $match: {
                        isDelete: false,
                        isActive: true,
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $group: {
                        _id: '$category.name',
                        records: { $push: '$$ROOT' },
                    },
                },
                {
                    $project: {
                        category: '$_id',
                        records: { $slice: ['$records', 7] },
                        _id: 0,
                    },
                },
            ];

            const result = await newsModel.aggregate(pipeline);
            return result;
        } catch (error) {
            console.error('getNewsGroupedByCategory Error:', error);
            throw error;
        }
    }


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
            console.log('update payload:', data);
            const { id, ...updateFields } = data;

            const updateNews = await newsModel.findByIdAndUpdate(
                id,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            return updateNews;
        } catch (error) {
            console.error('Update error:', error);
            return error;
        }
    }


};
