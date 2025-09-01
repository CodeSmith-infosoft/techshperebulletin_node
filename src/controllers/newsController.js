import {
    newsValidation,
    idValidation,
} from "../models/newsModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { newsService } from "../services/newsService.js";
// import { analyticsService } from './../services/analyticsService.js';
import { userService } from "../services/userService.js";
import sendMail from "../../config/mailer/index.js";
import { categoryService } from "../services/categoryService.js";
import { tagsService } from "../services/tagsService.js";

export const createNews = async (req, res) => {
    try {
        const mainImage = req.uploadedImages?.find(file => file.field === 'mainImage');
        req.body.mainImage = mainImage?.s3Url ?? "";
        const uploadedImages = req.uploadedImages || [];
        const matchedImage = uploadedImages.filter(file => file.field !== "mainImage");

        let newsArray = req.body.news ?? [];
        matchedImage.forEach(img => {
            const idx = img.index; // Number(img.index) ??
            if (!newsArray[idx]) {
                newsArray[idx] = {};
            };
            newsArray[idx].image = img.s3Url;
        });
        const newsWithImages = newsArray.map(item => ({ ...item }));

        const { title, description, categoryId, tagId, isPromoted } = req.body;
        const data = {
            ...req.body,
            mainImage: req.body.mainImage,
            news: newsWithImages,
            isPromoted: isPromoted ?? false
        };
        const { error } = newsValidation.validate(data);
        if (error) {
            return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
        };
        const newsSave = await newsService.createNews(data);

        const users = await userService.getUsers();
        const subscribedUsers = users.filter(u => u.isSubscribed && u.isActive);

        const categoryData = await categoryService.categoryExists({ _id: categoryId });
        const tagData = await tagsService.tagsExists({ _id: tagId });

        const shortDescription = description.split(" ").slice(0, 200).join(" ");
        const subject = `Breaking News: ${title}`;
        const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

        await Promise.all(
            subscribedUsers.map(user =>
                sendMail("news", subject, user?.email, {
                    title,
                    categoryName: categoryData.name,
                    tagName: tagData.name,
                    createdDate: formattedDate,
                    heroImage: req.body.mainImage,
                    description: shortDescription,
                    newsURL: `https://techshperebulletin.com/detail/${newsSave?._id}`
                })
            )
        );
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_ADD, newsSave);
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
        const mainImage = uploadedImages.find(file => file.field === "mainImage");
        req.body.mainImage = mainImage?.s3Url ?? req.body.mainImage;
        let newsArray = req.body.news ?? [];
        const matchedImage = uploadedImages.filter(file => file.field !== "mainImage");
        const newsWithImages = newsArray.map((item, idx) => {
            let finalBlock = { ...item };
            const uploadedImg = matchedImage.find(img => img.index == idx);
            if (uploadedImg) {
                finalBlock.image = uploadedImg.s3Url;
            };
            return finalBlock;
        });

        matchedImage.forEach(img => {
            const idx = Number(img.index);
            if (!newsWithImages[idx]) {
                newsWithImages[idx] = { image: img.s3Url };
            };
        });

        const finalNewsArray = newsWithImages.filter(
            block => block && (block.image || block.p || block.subTitle)
        );
        const data = {
            id,
            ...req.body,
            mainImage: req.body.mainImage,
            news: finalNewsArray,
            isPromoted: req.body.isPromoted ?? false
        };
        await newsService.updateNews(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.NEWS_UPDATE, {});
    } catch (err) {
        console.error("Error in updateNewsById:", err);
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
