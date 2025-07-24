'use strict'
import { Router } from "express";
import user from "./userRoutes.js";
import category from "./categoryRoutes.js";
import tags from "./tagsRoutes.js";
import news from "./newsRoutes.js";
import blog from "./blogRoutes.js";

const router = Router();

router.use("/user", user);
router.use("/category", category);
router.use("/tags", tags);
router.use("/news", news);
router.use("/blog", blog);

export default router;