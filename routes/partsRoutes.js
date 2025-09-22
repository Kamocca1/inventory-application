import { Router } from "express";
import {
    listParts,
    getPart,
    getPartForm,
    getPartEditForm,
    createPart,
    updatePart,
    deletePart,
} from "../controllers/partsController.js";

const router = Router();

router.get("/", listParts);
router.get("/create", getPartForm);
router.get("/:id/edit", getPartEditForm);
router.get("/:id", getPart);
router.post("/", createPart);
router.put("/:id", updatePart);
router.delete("/:id", deletePart);

export default router;
