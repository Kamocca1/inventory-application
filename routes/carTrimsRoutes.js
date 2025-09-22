import { Router } from "express";
import {
    listCarTrims,
    getCarTrim,
    createCarTrim,
    updateCarTrim,
    deleteCarTrim,
} from "../controllers/carTrimsController.js";

const router = Router();

router.get("/", listCarTrims);
router.get("/:id", getCarTrim);
router.post("/", createCarTrim);
router.put("/:id", updateCarTrim);
router.delete("/:id", deleteCarTrim);

export default router;
