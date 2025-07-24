import {
    categoryValidation,
    idValidation,
} from "../models/categoryModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { categoryService } from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const categoryExists = await categoryService.categoryExists({ name });
        if (categoryExists) {
            return response.error(res, resStatusCode.CONFLICT, resMessage.CATEGORY_FOUND);
        };
        await categoryService.createCategory({ name, description });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_ADD, {});
    } catch (err) {
        console.error("createCategory Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllCategory = async (req, res) => {
    try {
        const isLoggedIn = !!req.user;
        const { page = 1, limit = 10 } = req.query;
        const filter = isLoggedIn ? {} : { isActive: true };
        let result;
        if (isLoggedIn) {
            const pagination = {
                page: parseInt(page),
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
            };;
            result = await categoryService.getAllCategory({ filter, ...pagination });
        } else {
            result = await categoryService.getAllCategory({ filter });
        };
        if (isLoggedIn) {
            return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_LIST, {
                page: parseInt(page),
                limit: parseInt(limit),
                totalRecords: result.totalRecords,
                totalPages: Math.ceil(result.totalRecords / parseInt(limit)),
                records: result.records,
            });
        };
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_LIST, result);
    } catch (error) {
        console.error('getAllCategory Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const getCategory = await categoryService.categoryExists({ _id: id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_SINGLE, getCategory);
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const updateCategoryById = async (req, res) => {
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
        await categoryService.updateCategory(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_UPDATE, {});
    } catch (error) {
        console.error('Error in updateCategoryById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};