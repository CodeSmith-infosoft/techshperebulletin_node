import { Router } from "express";
const router = Router();
import {
    addContactUs,
    getAllContactUs,
} from "../controllers/contactController.js";
import { validateAccessToken, authorizeRoles } from "../middleware/auth.js";

router.post("/addContactUs", validateAccessToken, addContactUs);
router.get("/getAllContactUs", validateAccessToken, authorizeRoles(0), getAllContactUs);

export default router;