import {
    newsValidation,
    idValidation,
} from "../models/newsModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { newsService } from "../services/newsService.js";
// import { analyticsService } from './../services/analyticsService.js';

export const createNews = async (req, res) => {
    const mainImage = req.uploadedImages?.find(file => file.field === 'mainImage');
    req.body.mainImage = mainImage?.s3Url ?? "";
    const newsArray = req.body.news;
    const uploadedImages = req.uploadedImages || [];
    let newsWithImages = [];
    const matchedImage = uploadedImages.filter(file => file.field !== "mainImage")
    const i = newsArray.length > matchedImage.length ? newsArray.length : matchedImage.length;
    let j = 0;
    while (j < i) {
        let obj = {}
        if (newsArray?.[j]?.p) {
            obj.p = newsArray?.[j]?.p
        }
        let findImage = matchedImage.find(d => d.index == j)
        if (findImage) {
            obj.image = findImage.s3Url
        }
        newsWithImages.push(obj)
       j++ 
    };
    const { title, description, categoryId, tagId, isPromoted } = req.body;
    const data = {
        ...req.body,
        mainImage: req.body.mainImage,
        news: newsWithImages,
    };
    const { error } = newsValidation.validate(data);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        await newsService.createNews(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_ADD, {});
    } catch (err) {
        console.error("createNews Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllNews = async (req, res) => {
    try {
        const { categoryName, latestNews, tagName, isPromoted, page = 1, limit = 10 } = req.query;
        const filter = { isDelete: false };
        if (!req.user) {
            filter.isActive = true;
        };
        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };
        const { records, totalRecords } = await newsService.getAllNews({
            ...filter,
            categoryName,
            latestNews,
            tagName,
            isPromoted,
            ...pagination,
        });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_LIST, {
            page: pagination.page,
            limit: pagination.limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / pagination.limit),
            records,
        });
    } catch (error) {
        console.error('getAllNews Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getNewsById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const getNews = await newsService.newsExists({ _id: id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_SINGLE, getNews);
    } catch (error) {
        console.error('Error in getNewsById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const getAllHomeNews = async (req, res) => {
    try {
        const groupedNews = await newsService.getAllHomeNews();
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_LIST, groupedNews);
    } catch (error) {
        console.error('getAllHomeNews Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const updateNewsById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const uploadedImages = req.uploadedImages || [];
        const mainImage = uploadedImages.find(file => file.field === 'mainImage');
        req.body.mainImage = mainImage?.s3Url ?? req.body.mainImage;
        const formNewsBlocks = Array.isArray(req.body.news) ? req.body.news : [];
        const extraNewsBlocks = {};
        Object.keys(req.body).forEach((key) => {
            const match = key.match(/^news\[(\d+)]\[(p|image)]$/);
            if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
                if (!extraNewsBlocks[index]) extraNewsBlocks[index] = {};
                extraNewsBlocks[index][field] = req.body[key];
            };
        });
        Object.keys(extraNewsBlocks).forEach((idxStr) => {
            const index = parseInt(idxStr, 10);
            formNewsBlocks[index] = {
                ...(formNewsBlocks[index] || {}),
                ...extraNewsBlocks[index],
            };
        });
        uploadedImages.forEach((file) => {
            const match = file.field.match(/^news\[(\d+)]\[image]$/);
            if (match) {
                const index = parseInt(match[1], 10);
                if (formNewsBlocks[index]?.image) {
                    formNewsBlocks.push({
                        image: file.s3Url,
                    });
                } else {
                    formNewsBlocks[index] = {
                        ...(formNewsBlocks[index] || {}),
                        image: file.s3Url,
                    };
                };
            };
        });
        const finalNewsArray = formNewsBlocks.filter(block => block && (block.image || block.p));
        const data = {
            id,
            ...req.body,
            news: finalNewsArray,
        };
        await newsService.updateNews(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_UPDATE, {});
    } catch (error) {
        console.error('Error in updateNewsById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const deleteNewsById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const data = {
            id,
            isDelete: true
        };
        await newsService.updateNews(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_DELETE, {});
    } catch (error) {
        console.error('Error in updateNewsById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

// export const getTopNewsByAnalytics = async (req, res) => {
//     try {
//         const newsIds = await analyticsService.fetchTopNewsViews();
//         const topNews = await newsService.getTopNewsByAnalytics(newsIds);
//         return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.ACTION_COMPLETE, topNews);
//     } catch (error) {
//         console.error('getAllHomeNews Error:', error);   
//         return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
//     };
// };