import { Router } from "express";
const router = Router();
import {
    createNews,
    getAllNews,
    getNewsById,
    updateNewsById,
    deleteNewsById,
    getAllHomeNews,
} from "../controllers/newsController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";
import { newsImages } from "../utils/uploadHandler.js";

router.post("/createNews", validateAccessToken, authorizeRoles(0), newsImages, createNews);
router.get("/getAllNews", getAllNews);
router.get("/adminGetAllNews", validateAccessToken, authorizeRoles(0), getAllNews);
router.get("/getAllHomeNews", getAllHomeNews);
router.get("/getNews/:id", getNewsById);
router.put("/updateNews/:id", validateAccessToken, authorizeRoles(0), newsImages, updateNewsById);
router.delete("/deleteNews/:id", validateAccessToken, authorizeRoles(0), deleteNewsById);

export default router;