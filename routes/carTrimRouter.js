import { Router } from "express";
import {
    listCarTrimsHandler,
    getCarTrimHandler,
    getCarTrimFormHandler,
    getCarTrimEditFormHandler,
    createCarTrimHandler,
    updateCarTrimHandler,
    deleteCarTrimHandler,
} from "../controllers/carTrimController.js";

const carTrimRouter = Router();

carTrimRouter.get("/", listCarTrimsHandler);
carTrimRouter.get("/create", getCarTrimFormHandler);
carTrimRouter.get("/:id/edit", getCarTrimEditFormHandler);
carTrimRouter.get("/:id", getCarTrimHandler);
carTrimRouter.post("/", createCarTrimHandler);
carTrimRouter.put("/:id", updateCarTrimHandler);
carTrimRouter.post("/:id/delete", deleteCarTrimHandler);

export default carTrimRouter;
