import { Router } from "express";
import {
    listCarTrims,
    getCarTrim,
    getCarTrimForm,
    getCarTrimEditForm,
    createCarTrim,
    updateCarTrim,
    deleteCarTrim,
} from "../controllers/carTrimsController.js";

const router = Router();

router.get("/", listCarTrims);
router.get("/create", getCarTrimForm);
router.get("/:id/edit", getCarTrimEditForm);
router.get("/:id", getCarTrim);
router.post("/", createCarTrim);
router.put("/:id", updateCarTrim);
router.delete("/:id", deleteCarTrim);

export default router;
