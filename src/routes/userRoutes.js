import { Router } from "express";
const router = Router();
import {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deactiveUser,
    changePassword,
    getGoogleOAuthUrl,
    googleOAuthLogin,
    JoinNewsLetter,
} from "../controllers/userController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/getUserProfile", validateAccessToken, getUserProfile);
router.put("/updateUserProfile", validateAccessToken, updateUserProfile);
router.get("/getAllUsers", validateAccessToken, authorizeRoles(0), getAllUsers);
router.put("/deactiveUser/:id", validateAccessToken, authorizeRoles(0), deactiveUser);
router.post("/changePassword", validateAccessToken, changePassword);
router.get("/getGoogleOAuthUrl", getGoogleOAuthUrl);
router.post("/googleOAuthLogin", googleOAuthLogin);
router.post("/JoinNewsLetter", JoinNewsLetter);

export default router;