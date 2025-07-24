import { Router } from "express";
const router = Router();
import {
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlogById,
    deleteBlogById,
} from "../controllers/blogController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";
import { blogImage } from "../utils/uploadHandler.js";

router.post("/createBlog", validateAccessToken, authorizeRoles(0), blogImage, createBlog);
router.get("/getAllBlog", getAllBlog);
router.get("/adminGetAllBlog", validateAccessToken, authorizeRoles(0), getAllBlog);
router.get("/getBlog/:id", getBlogById);
router.put("/updateBlog/:id", validateAccessToken, authorizeRoles(0), blogImage, updateBlogById);
router.delete("/deleteBlog/:id", validateAccessToken, authorizeRoles(0), deleteBlogById);

export default router;