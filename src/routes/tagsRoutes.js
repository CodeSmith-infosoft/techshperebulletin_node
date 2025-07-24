import { Router } from "express";
const router = Router();
import {
    createTag,
    getAllTags,
    getTagById,
    updateTagById,
} from "../controllers/tagsController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";

router.post("/createTag", validateAccessToken, authorizeRoles(0), createTag);
router.get("/getAllTags", getAllTags);
router.get("/adminGetAllTags", validateAccessToken, authorizeRoles(0), getAllTags);
router.get("/getTag/:id", getTagById);
router.put("/updateTag/:id", validateAccessToken, authorizeRoles(0), updateTagById);

export default router;