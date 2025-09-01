import {
    blogValidation,
    idValidation,
} from "../models/blogModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { blogService } from "../services/blogService.js";
import { userService } from "../services/userService.js";
import sendMail from "../../config/mailer/index.js";

export const createBlog = async (req, res) => {
    const image = req.uploadedImages.find(file => file.field === 'image');
    req.body.image = image?.s3Url ?? "";
    const { title, text, mailDescription } = req.body;
    const { error } = blogValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const saveBlog = await blogService.createBlog(req.body);
        const users = await userService.getUsers();
        const subscribedUsers = users.filter(u => u.isSubscribed && u.isActive);

        const shortDescription = mailDescription.split(" ").slice(0, 200).join(" ");
        const subject = "📰 Just In: A New Blog from Techsphere Bulletin You Can’t Miss!";
        const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

        await Promise.all(
            subscribedUsers.map(user =>
                sendMail("blog", subject, user?.email, {
                    title,
                    createdDate: formattedDate,
                    heroImage: req.body.image,
                    description: shortDescription,
                    blogURL: `https://techshperebulletin.com/blog/${saveBlog?._id}`
                })
            )
        );

        // const getAllUsers = await userService.getUsers();
        // console.log('getAllUsers', getAllUsers)
        // const subscribedUsers = getAllUsers.filter(user => user.isSubscribed && user.isActive);
        // console.log('subscribedUsers', subscribedUsers)
        // const subscriberEmails = subscribedUsers.map(sub => sub.email);

        // const shortDescription = mailDescription.split(" ").slice(0, 200).join(" ");
        // const subject = "📰 Just In: A New Blog from Techsphere Bulletin You Can’t Miss!";
        // const date = new Date();
        // const options = { day: '2-digit', month: 'long', year: 'numeric' };
        // const formattedDate = date.toLocaleDateString('en-GB', options);
        // sendMail("blog", subject, subscriberEmails.join(','), {
        //     title: title,
        //     createdDate: formattedDate,
        //     heroImage: req.body.image,
        //     description: shortDescription,
        //     blogURL: `https://techshperebulletin.com/blog/${saveBlog?._id}`,
        // });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_ADD, {});
    } catch (err) {
        console.error("createBlog Error:", err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getAllBlog = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const filter = req.user ? { isDelete: false } : { isActive: true, isDelete: false };
        const pagination = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        };
        const { records, totalRecords } = await blogService.getAllBlog({ filter, ...pagination });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_LIST, {
            page: pagination.page,
            limit: pagination.limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / pagination.limit),
            records,
        });
    } catch (error) {
        console.error('getAllBlog Error:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR);
    };
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const getBlog = await blogService.blogExists({ _id: id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_SINGLE, getBlog);
    } catch (error) {
        console.error('Error in getBlogById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const updateBlogById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const image = req.uploadedImages.find(file => file.field === 'image');
    req.body.image = image?.s3Url ?? "";
    try {
        const data = {
            id,
            ...req.body,
        };
        await blogService.updateBlogById(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_UPDATE, {});
    } catch (error) {
        console.error('Error in updateBlogById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const deleteBlogById = async (req, res) => {
    const { id } = req.params;
    const { error } = idValidation.validate({ id });
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const data = {
            id,
            isDelete: true,
        };
        await blogService.updateBlogById(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.BLOG_DELETE, {});
    } catch (error) {
        console.error('Error in updateNewsById:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};