import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { dbTableName } from "../utils/constants.js"

const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        text: { type: String, required: true },
        isDelete: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const blogModel = model(dbTableName.BLOGS, blogSchema);

export const blogValidation = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    image: Joi.string().required().messages({
        'string.base': 'Image must be a string',
        'string.empty': 'Image is required',
        'any.required': 'Image is required',
    }),
    text: Joi.string().required().messages({
        'string.base': 'Text must be a string',
        'string.empty': 'Text is required',
        'any.required': 'Text is required',
    }),
    mailDescription: Joi.string().required().messages({
        'string.base': 'Mail Description must be a string',
        'string.empty': 'Mail Description is required',
        'any.required': 'Mail Description is required',
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