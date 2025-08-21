import { Router } from "express";
const router = Router();
import {
    getEventStats
} from "../controllers/analyticsController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";
import { newsImages } from "../utils/uploadHandler.js";

router.get("/getEventStats", validateAccessToken, authorizeRoles(0), getEventStats);
// router.get("/getAllNews", getAllNews);
// router.get("/adminGetAllNews", validateAccessToken, authorizeRoles(0), getAllNews);
// router.get("/getAllHomeNews", getAllHomeNews);
// router.get("/getNews/:id", getNewsById);
// router.put("/updateNews/:id", validateAccessToken, authorizeRoles(0), newsImages, updateNewsById);
// router.delete("/deleteNews/:id", validateAccessToken, authorizeRoles(0), deleteNewsById);

export default router;