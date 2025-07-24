import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema, Types } = mongoose;
import { dbTableName } from "../utils/constants.js"

const newsSchema = new Schema(
    {
        title: { type: String, required: true },
        mainImage: { type: String, required: true },
        description: { type: String, required: true },
        news: [
            {
                _id: false,
                image: { type: String, required: false },
                p: { type: String, required: false },
            },
        ],
        categoryId: { type: Types.ObjectId, ref: dbTableName.CATEGORYS },
        tagId: { type: Types.ObjectId, ref: dbTableName.TAGS },
        isDelete: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const newsModel = model(dbTableName.NEWS, newsSchema);

const newsArrayValidation = Joi.object({
    image: Joi.string().optional().messages({
        'string.base': 'image must be a string',
        'string.empty': 'image is required',
        'any.required': 'image is required',
    }),
    p: Joi.number().optional().messages({
        'number.base': 'Paragraph must be a number',
        'any.required': 'Paragraph is required',
    }),
});

export const newsValidation = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    mainImage: Joi.string().required().messages({
        'string.base': 'mainImage must be a string',
        'string.empty': 'mainImage is required',
        'any.required': 'mainImage is required',
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    news: Joi.array().items(newsArrayValidation).messages({
        'array.base': 'News must be an array',
    }),
    categoryId: Joi.string().length(24).hex().required().messages({
        "string.base": "Category Id must be a string",
        "string.empty": "Category Id is required",
        "string.length": "Category Id must be exactly 24 characters",
        "string.hex": "Category Id must be a valid hexadecimal string",
        "any.required": "Category Id is required",
    }),
    tagId: Joi.string().length(24).hex().required().messages({
        "string.base": "tag Id must be a string",
        "string.empty": "tag Id is required",
        "string.length": "tag Id must be exactly 24 characters",
        "string.hex": "tag Id must be a valid hexadecimal string",
        "any.required": "tag Id is required",
    }),
});

export const idValidation = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
        "string.base": "ID must be a string",
        "string.empty": "ID is required",
        "string.length": "ID must be exactly 24 characters",
        "string.hex": "ID must be a valid hexadecimal string",
        "any.required": "ID is required",
    }),
});