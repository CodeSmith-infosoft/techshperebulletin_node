import { Router } from "express";
const router = Router();
import {
    addContactUs,
    getAllContactUs,
    // getTagById,
    // updateTagById,
} from "../controllers/contactController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";

router.post("/addContactUs", validateAccessToken, addContactUs);
router.get("/getAllContactUs", validateAccessToken, authorizeRoles(0), getAllContactUs);
// router.get("/getAllTags", getAllTags);
// router.get("/getTag/:id", getTagById);
// router.put("/updateTag/:id", validateAccessToken, authorizeRoles(0), updateTagById);

export default router;