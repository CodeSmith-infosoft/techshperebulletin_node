import {
    newsValidation,
    idValidation,
} from "../models/newsModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { newsService } from "../services/newsService.js";

export const createNews = async (req, res) => {
    const mainImage = req.uploadedImages?.find(file => file.field === 'mainImage');
    req.body.mainImage = mainImage?.s3Url ?? "";

    const imageUrls = req.uploadedImages?.filter(file => file.field === 'image').map(file => file.s3Url) ?? [];
    const newsArray = req.body.news;
    const newsWithImages = Array.isArray(newsArray)
        ? newsArray.map((item, index) => ({
            ...item,
            image: imageUrls[index] || item.image || ""
        }))
        : [];
    const { title, description, news, categoryId, tagId } = req.body;

    const data = {
        ...req.body,
        mainImage: req.body.mainImage,
        image: newsWithImages,
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
        const { categoryName, latestNews, tagName, page = 1, limit = 10 } = req.query;
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

export const updateNewsById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const data = {
            id,
            ...req.body,
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