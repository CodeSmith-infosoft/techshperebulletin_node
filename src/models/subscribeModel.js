import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { dbTableName } from "../utils/constants.js"

const subscribeSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: dbTableName.AUTH, required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: dbTableName.AUTH, required: true },
    },
    { timestamps: true },
);
export const subscribeModel = model(dbTableName.SUBSCRIBE, subscribeSchema);

export const subscribeValidation = Joi.object({
    categoryId: Joi.string().length(24).hex().required().messages({
        "string.pattern.base": "Category ID must be a valid MongoDB ObjectId",
        "string.empty": "Category ID is required",
        "any.required": "Category ID is required",
    }),
});