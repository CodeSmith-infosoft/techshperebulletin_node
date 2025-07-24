import {
    blogValidation,
    idValidation,
} from "../models/blogModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { blogService } from "../services/blogService.js";

export const createBlog = async (req, res) => {
    const image = req.uploadedImages.find(file => file.field === 'image');
    req.body.image = image?.s3Url ?? "";
    const { title, text } = req.body;
    const { error } = blogValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        await blogService.createBlog(req.body);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_ADD, {});
    } catch (err) {
        console.error("createBlog Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllBlog = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const filter = req.user ? {} : { isActive: true, isDelete: false };
        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };
        const { records, totalRecords } = await blogService.getAllBlog({ filter, ...pagination });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_LIST, {
            page: pagination.page,
            limit: pagination.limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / pagination.limit),
            records,
        });
    } catch (error) {
        console.error('getAllBlog Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const getBlog = await blogService.blogExists({ _id: id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_SINGLE, getBlog);
    } catch (error) {
        console.error('Error in getBlogById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const updateBlogById = async (req, res) => {
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
        await blogService.updateBlogById(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_UPDATE, {});
    } catch (error) {
        console.error('Error in updateBlogById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const deleteBlogById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const data = {
            id,
            isDelete: true,
        };
        await blogService.updateBlogById(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_DELETE, {});
    } catch (error) {
        console.error('Error in updateNewsById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};