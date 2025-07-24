import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema, Types } = mongoose;
import { dbTableName } from "../utils/constants.js"

const tagsSchema = new Schema(
    {
        name: { type: String, required: true },
        categoryId: { type: Types.ObjectId, ref: dbTableName.CATEGORYS },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const tagsModel = model(dbTableName.TAGS, tagsSchema);

export const tagsValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    categoryId: Joi.string().length(24).hex().required().messages({
        "string.base": "Category Id must be a string",
        "string.empty": "Category Id is required",
        "string.length": "Category Id must be exactly 24 characters",
        "string.hex": "Category Id must be a valid hexadecimal string",
        "any.required": "Category Id is required",
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