import { Router } from "express";
import {
    listPartCategoriesHandler,
    getPartCategoryHandler,
    getPartCategoryFormHandler,
    getPartCategoryEditFormHandler,
    createPartCategoryHandler,
    updatePartCategoryHandler,
    deletePartCategoryHandler,
} from "../controllers/partCategoryController.js";

const partCategoryRouter = Router();

partCategoryRouter.get("/", listPartCategoriesHandler);
partCategoryRouter.get("/create", getPartCategoryFormHandler);
partCategoryRouter.get("/:id/edit", getPartCategoryEditFormHandler);
partCategoryRouter.get("/:id", getPartCategoryHandler);
partCategoryRouter.post("/", createPartCategoryHandler);
partCategoryRouter.put("/:id", updatePartCategoryHandler);
partCategoryRouter.post("/:id/delete", deletePartCategoryHandler);

export default partCategoryRouter;
