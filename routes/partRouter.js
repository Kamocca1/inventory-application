import { Router } from "express";
import {
    listPartsHandler,
    getPartHandler,
    getPartFormHandler,
    getPartEditFormHandler,
    createPartHandler,
    updatePartHandler,
    deletePartHandler,
} from "../controllers/partController.js";
import { sanitizePartData } from "../middleware/validation.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const partRouter = Router();

partRouter.get("/create", isAdmin, getPartFormHandler);
partRouter.post("/create", isAdmin, sanitizePartData, createPartHandler);
partRouter.get("/", listPartsHandler);
partRouter.get("/:id", getPartHandler);
partRouter.get("/:id/edit", isAdmin, getPartEditFormHandler);
partRouter.put("/:id/edit", isAdmin, sanitizePartData, updatePartHandler);
partRouter.post("/:id/delete", isAdmin, deletePartHandler);

export default partRouter;
