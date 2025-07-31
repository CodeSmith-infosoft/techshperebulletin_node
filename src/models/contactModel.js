import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema, Types } = mongoose;
import { dbTableName } from "../utils/constants.js"

const contactSchema = new Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        type: { type: String, required: true },
        message: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);
export const contactModel = model(dbTableName.CONTACT, contactSchema);

export const contactValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    mobile: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Mobile must be a valid 10-digit number',
        'string.empty': 'Mobile is required',
        'any.required': 'Mobile is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    type: Joi.string().required().messages({
        'string.empty': 'Type is required',
        'any.required': 'Type is required',
    }),
    message: Joi.string().min(10).required().messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.empty': 'Message is required',
        'any.required': 'Message is required',
    }),
});

