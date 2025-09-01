import { Router } from "express";
const router = Router();
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    getAllCategoryWithTags,
} from "../controllers/categoryController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";

router.post("/createCategory", validateAccessToken, authorizeRoles(0), createCategory);
router.get("/getAllCategory", getAllCategory);
router.get("/adminGetAllCategory", validateAccessToken, authorizeRoles(0), getAllCategory);
router.get("/getCategory/:id", getCategoryById);
router.put("/updateCategory/:id", validateAccessToken, authorizeRoles(0), updateCategoryById);
router.get("/getAllCategoryWithTags", getAllCategoryWithTags);

export default router;