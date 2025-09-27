import { Router } from "express";
import {
    listCarModelsHandler,
    getCarModelHandler,
    getCarModelFormHandler,
    getCarModelEditFormHandler,
    createCarModelHandler,
    updateCarModelHandler,
    deleteCarModelHandler,
} from "../controllers/carModelController.js";

const carModelRouter = Router();

carModelRouter.get("/create", getCarModelFormHandler);
carModelRouter.get("/", listCarModelsHandler);
carModelRouter.get("/:id/edit", getCarModelEditFormHandler);
carModelRouter.get("/:id", getCarModelHandler);
carModelRouter.post("/", createCarModelHandler);
carModelRouter.put("/:id", updateCarModelHandler);
carModelRouter.post("/:id/delete", deleteCarModelHandler);

export default carModelRouter;
