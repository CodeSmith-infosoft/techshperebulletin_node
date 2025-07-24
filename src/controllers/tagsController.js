import {
    tagsValidation,
    idValidation,
} from "../models/tagsModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { tagsService } from "../services/tagsService.js";

export const createTag = async (req, res) => {
    const { name, categoryId } = req.body;
    const { error } = tagsValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const tagsExists = await tagsService.tagsExists({ name });
        if (tagsExists) {
            return response.error(res, resStatusCode.CONFLICT, resMessage.TAGS_FOUND);
        };
        await tagsService.createTag({ name, categoryId, });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_ADD, {});
    } catch (err) {
        console.error("createTag Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllTags = async (req, res) => {
    try {
        const isUserLoggedIn = !!req.user;
        const filter = isUserLoggedIn ? {} : { isActive: true };
        if (isUserLoggedIn) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const [totalRecords, tags] = await Promise.all([
                tagsService.countTags(filter),
                tagsService.getAllTags(filter, skip, limit)
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_LIST, {
                page,
                limit,
                totalRecords,
                totalPages,
                records: tags
            });
        } else {
            const tags = await tagsService.getAllTags(filter);
            return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_LIST, tags);
        };
    } catch (error) {
        console.error('getAllTags Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getTagById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const getTag = await tagsService.tagsExists({ _id: id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_SINGLE, getTag);
    } catch (error) {
        console.error('Error in getTagById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const updateTagById = async (req, res) => {
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
        await tagsService.updateTags(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_UPDATE, {});
    } catch (error) {
        console.error('Error in updateTagById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};