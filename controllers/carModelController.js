import {
    findAllCarModels,
    findCarModelById,
    createCarModel,
    updateCarModel,
    deleteCarModel,
} from "../models/CarModel.js";

export async function listCarModelsHandler(req, res) {
    try {
        const models = await findAllCarModels();
        res.render("car_models/index", { models });
    } catch (err) {
        console.error("List car models error:", err);
        res.status(500).json({ error: "Failed to load car models" });
    }
}

export async function getCarModelHandler(req, res) {
    const { id } = req.params;
    try {
        const model = await findCarModelById(id);
        if (!model) return res.status(404).json({ error: "Not found" });
        res.render("car_models/detail", { model });
    } catch (err) {
        console.error("Get car model error:", err);
        res.status(500).json({ error: "Failed to load car model" });
    }
}

export function getCarModelFormHandler(req, res) {
    res.render("car_models/create");
}

export async function getCarModelEditFormHandler(req, res) {
    const { id } = req.params;
    try {
        const model = await findCarModelById(id);
        if (!model) return res.status(404).json({ error: "Not found" });
        res.render("car_models/edit", { model });
    } catch (err) {
        console.error("Get car model edit form error:", err);
        res.status(500).json({ error: "Failed to load car model" });
    }
}

export async function createCarModelHandler(req, res) {
    try {
        const {
            series_name,
            model_code,
            body_style,
            market,
            start_year,
            end_year,
            notes,
        } = req.body;

        const sanitizedData = {
            series_name: series_name?.trim(),
            model_code: model_code?.trim(),
            body_style:
                body_style && body_style.trim() !== ""
                    ? body_style.trim()
                    : null,
            market: market && market.trim() !== "" ? market.trim() : null,
            start_year:
                start_year && start_year !== "" ? parseInt(start_year) : null,
            end_year: end_year && end_year !== "" ? parseInt(end_year) : null,
            notes: notes && notes.trim() !== "" ? notes.trim() : null,
        };

        if (!sanitizedData.series_name || !sanitizedData.model_code) {
            return res
                .status(400)
                .json({ error: "Series name and model code are required" });
        }

        const model = await createCarModel(sanitizedData);
        res.redirect(`/car-models/${model.id}`);
    } catch (err) {
        console.error("Create car model error:", err);
        res.status(500).json({
            error: `Failed to create car model: ${err.message}`,
        });
    }
}

export async function updateCarModelHandler(req, res) {
    const { id } = req.params;
    try {
        const {
            series_name,
            model_code,
            body_style,
            market,
            start_year,
            end_year,
            notes,
        } = req.body;

        const sanitizedData = {
            series_name: series_name?.trim(),
            model_code: model_code?.trim(),
            body_style:
                body_style && body_style.trim() !== ""
                    ? body_style.trim()
                    : null,
            market: market && market.trim() !== "" ? market.trim() : null,
            start_year:
                start_year && start_year !== "" ? parseInt(start_year) : null,
            end_year: end_year && end_year !== "" ? parseInt(end_year) : null,
            notes: notes && notes.trim() !== "" ? notes.trim() : null,
        };

        if (!sanitizedData.series_name || !sanitizedData.model_code) {
            return res
                .status(400)
                .json({ error: "Series name and model code are required" });
        }

        const model = await updateCarModel(id, sanitizedData);
        if (!model) return res.status(404).json({ error: "Not found" });
        res.redirect(`/car-models/${id}`);
    } catch (err) {
        console.error("Update car model error:", err);
        res.status(500).json({
            error: `Failed to update car model: ${err.message}`,
        });
    }
}

export async function deleteCarModelHandler(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deleteCarModel(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.redirect("/car-models");
    } catch (err) {
        console.error("Delete car model error:", err);
        res.status(500).json({
            error: `Failed to delete car model: ${err.message}`,
        });
    }
}
