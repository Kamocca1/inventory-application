import { Router } from "express";
import {
    listPartCategories,
    getPartCategory,
    getPartCategoryForm,
    getPartCategoryEditForm,
    createPartCategory,
    updatePartCategory,
    deletePartCategory,
} from "../controllers/partCategoriesController.js";

const router = Router();

router.get("/", listPartCategories);
router.get("/create", getPartCategoryForm);
router.get("/:id/edit", getPartCategoryEditForm);
router.get("/:id", getPartCategory);
router.post("/", createPartCategory);
router.put("/:id", updatePartCategory);
router.delete("/:id", deletePartCategory);

export default router;
