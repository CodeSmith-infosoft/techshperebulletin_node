import {
    authRegisterValidation,
    authLoginValidation,
    idValidation,
    googleOAuthValidation,
} from "../models/userModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { generateJWToken } from "../middleware/auth.js";
import { hash, compare } from "bcrypt";
import { userService } from "../services/userService.js";
import { subscribeService } from "../services/subscribeService.js";
import axios from 'axios';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const { error } = authRegisterValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        req.body.role = 1;
        const userExists = await userService.userExists({ email: email });
        if (userExists?.email) {
            return response.error(res, resStatusCode.CONFLICT, resMessage.USER_FOUND, {});
        };
        const hashedPassword = await hash(password, 10);
        req.body.password = hashedPassword;
        const createNewUser = await userService.createUser(req.body, hashedPassword);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.USER_REGISTER, { _id: createNewUser._id });
    } catch (error) {
        console.error('Error in register:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { error } = authLoginValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const userExists = await userService.userExists({ email, isActive: true });
        if (!userExists) {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        if (userExists?.role === 2) {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.GOOGLE_USER, {});
        };
        const validPassword = await compare(password, userExists.password);
        if (!validPassword) {
            return response.error(res, resStatusCode.UNAUTHORISED, resMessage.INCORRECT_PASSWORD, {});
        };
        const getSubscribedCategoryList = await subscribeService.getSubscribedCategoryList(userExists);
        const token = await generateJWToken({ _id: userExists._id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, {
            _id: userExists._id,
            token: token,
            category: getSubscribedCategoryList
        });
    } catch (error) {
        console.error('Error in login:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const getUserProfile = async (req, res) => {
    try {
        const userProfile = await userService.userExists({ _id: req.user.id });
        const modifyResponse = userProfile.toObject();
        delete modifyResponse.password;
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.GET_PROFILE, modifyResponse);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const updateUserProfile = async (req, res) => {
    try {
        const data = {
            ...req.body,
            id: req.user.id
        };
        await userService.updateUser(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.UPDATE_PROFILE, {});
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getUsers();
        if (!allUsers) {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.DATA_NOT_FOUND, {});
        };
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.USER_LIST, allUsers);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const deactiveUser = async (req, res) => {
    const { id } = req.params;
    try {
        const data = {
            id,
            isActive: false
        };
        await userService.updateUser(data);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.DEACTIVE_PROFILE, {});
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getGoogleOAuthUrl(req, res) {
    try {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&scope=openid%20email%20profile`;
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.GOOGLE_OAUTH_URL_GENERATED, url);
    } catch (err) {
        console.error(err);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function googleOAuthLogin(req, res) {
    const { code } = req.body;
    const { error } = googleOAuthValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const decodedCode = decodeURIComponent(code);
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code: decodedCode,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
            grant_type: process.env.GRANT_TYPE
        });
        const accessToken = tokenResponse.data?.access_token;
        if (!accessToken) {
            return response.error(res, resStatusCode.UNAUTHORISED, "Failed to retrieve access token.");
        };
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
        const googleUser = userInfoResponse.data;
        if (!googleUser?.email) {
            return response.error(res, resStatusCode.CLIENT_ERROR, resMessage.GOOGLE_EMAIL_NOT_FOUND, {});
        } ''

        let user = await userService.userExists({ email: googleUser.email });
        if (!user) {
            const newUser = {
                name: `${googleUser.given_name || ''} ${googleUser.family_name || ''}`.trim(),
                email: googleUser.email,
                role: 2
            };
            user = await userService.createUser(newUser);
        };
        const categories = await subscribeService.getSubscribedCategoryList({ id: user._id });
        const token = await generateJWToken({ id: user._id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.GOOGLE_AUTH_SUCCESS, {
            _id: user._id,
            token,
            category: categories || []
        });
    } catch (err) {
        const errorCode = err.response?.data?.error;
        const errorDesc = err.response?.data?.error_description;
        if (errorCode === 'invalid_grant' || errorDesc === 'Bad Request') {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.AUTHORIZATION_CODE_EXPIRED, {});
        };
        console.error('Google OAuth Error:', err?.response?.data || err.message);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};