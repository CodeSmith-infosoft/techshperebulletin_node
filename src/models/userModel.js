import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema, Types } = mongoose;
import { dbTableName } from "../utils/constants.js"

const authRegisterSchema = new Schema(
    {
        name: { type: String, default: '' },
        email: { type: String, required: true },
        password: { type: String, default: '' },
        subscribedCats: [{ type: Types.ObjectId, ref: dbTableName.CATEGORYS }],
        isSubscribed: { type: Boolean, default: false },
        role: { type: Number, required: true, default: 3 },
        isActive: { type: Boolean, default: false },
    },
    { timestamps: true },
);
export const userModel = model(dbTableName.AUTH, authRegisterSchema);

export const authRegisterValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Your Name must be a string",
        "string.empty": "Your Name is required",
        "any.required": "Your Name is required",
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});

export const authLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
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

export const googleOAuthValidation = Joi.object({
    code: Joi.string().trim().required().messages({
        'string.empty': 'Authorization code is required',
        'string.email': 'Please provide a valid Authorization code',
        'any.required': 'Authorization code is required'
    }),
});

export const changePasswordValidation = Joi.object({
    oldPassword: Joi.string().min(6).max(30).required().messages({
        'string.empty': 'oldPassword is required',
        'string.min': 'oldPassword must be at least 6 characters',
        'any.required': 'oldPassword is required'
    }),
    newPassword: Joi.string().min(6).max(30).required().messages({
        'string.empty': 'newPassword is required',
        'string.min': 'newPassword must be at least 6 characters',
        'any.required': 'newPassword is required'
    }),
});

export const JoinNewsLetterValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
});