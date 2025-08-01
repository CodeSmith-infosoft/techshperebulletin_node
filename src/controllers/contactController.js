import {
    contactValidation,
} from "../models/contactModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { tagsService } from "../services/contactService.js";

export const addContactUs = async (req, res) => {
    const { name, mobile, email, type, message } = req.body;
    const { error } = contactValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        await tagsService.addContactUs(req.body);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_ADD, {});
    } catch (err) {
        console.error("createTag Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllContactUs = async (req, res) => {
    const { type } = req.query;
    try {
        const filter = {};
        if (type) {
            filter.type = type;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [totalRecords, tags] = await Promise.all([
            tagsService.getAllContactUsCount(filter),
            tagsService.getAllContactUs(filter, skip, limit)
        ]);
        const totalPages = Math.ceil(totalRecords / limit);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.TAGS_LIST, {
            page,
            limit,
            totalRecords,
            totalPages,
            records: tags
        });
    } catch (error) {
        console.error('getAllTags Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};