import { Router } from "express";
import {
    listCarModels,
    getCarModel,
    getCarModelForm,
    getCarModelEditForm,
    createCarModel,
    updateCarModel,
    deleteCarModel,
} from "../controllers/carModelsController.js";

const router = Router();

router.get("/", listCarModels);
router.get("/create", getCarModelForm);
router.get("/:id/edit", getCarModelEditForm);
router.get("/:id", getCarModel);
router.post("/", createCarModel);
router.put("/:id", updateCarModel);
router.delete("/:id", deleteCarModel);

export default router;
