import { Router } from "express";
import {
    listPartCategories,
    getPartCategory,
    createPartCategory,
    updatePartCategory,
    deletePartCategory,
} from "../controllers/partCategoriesController.js";

const router = Router();

router.get("/", listPartCategories);
router.get("/:id", getPartCategory);
router.post("/", createPartCategory);
router.put("/:id", updatePartCategory);
router.delete("/:id", deletePartCategory);

export default router;
