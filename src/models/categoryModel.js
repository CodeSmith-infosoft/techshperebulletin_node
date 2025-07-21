import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { dbTableName } from "../utils/constants.js"

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const categoryModel = model(dbTableName.CATEGORY, categorySchema);

export const categoryValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    description: Joi.string().trim().required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    image: Joi.string().uri().required().messages({
        'string.base': 'Image must be a string',
        'string.uri': 'Image must be a valid URL',
        'any.required': 'Image URL is required',
    }),
});
