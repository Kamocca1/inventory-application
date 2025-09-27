import {
    findAllCarTrims,
    findCarTrimById,
    createCarTrim,
    updateCarTrim,
    deleteCarTrim,
} from "../models/CarTrim.js";

export async function listCarTrimsHandler(req, res) {
    try {
        const trims = await findAllCarTrims();
        res.render("car_trims/index", { trims });
    } catch (err) {
        console.error("List car trims error:", err);
        res.status(500).json({ error: "Failed to fetch car trims" });
    }
}

export async function getCarTrimHandler(req, res) {
    const { id } = req.params;
    try {
        const trim = await findCarTrimById(id);
        if (!trim) return res.status(404).json({ error: "Not found" });
        res.render("car_trims/detail", { trim });
    } catch (err) {
        console.error("Get car trim error:", err);
        res.status(500).json({ error: "Failed to load car trim" });
    }
}

export function getCarTrimFormHandler(req, res) {
    res.render("car_trims/create");
}

export async function getCarTrimEditFormHandler(req, res) {
    const { id } = req.params;
    try {
        const trim = await findCarTrimById(id);
        if (!trim) return res.status(404).json({ error: "Not found" });
        res.render("car_trims/edit", { trim });
    } catch (err) {
        console.error("Get car trim edit form error:", err);
        res.status(500).json({ error: "Failed to load car trim" });
    }
}

export async function createCarTrimHandler(req, res) {
    try {
        const {
            car_model_id,
            trim_name,
            engine_code,
            fuel_type,
            transmission,
            drive_type,
            displacement_cc,
            horsepower_ps,
            torque_nm,
            start_year,
            end_year,
            market,
            notes,
        } = req.body;

        const sanitizedData = {
            car_model_id:
                car_model_id && car_model_id.trim() !== ""
                    ? car_model_id.trim()
                    : null,
            trim_name: trim_name?.trim(),
            engine_code:
                engine_code && engine_code.trim() !== ""
                    ? engine_code.trim()
                    : null,
            fuel_type:
                fuel_type && fuel_type.trim() !== "" ? fuel_type.trim() : null,
            transmission:
                transmission && transmission.trim() !== ""
                    ? transmission.trim()
                    : null,
            drive_type:
                drive_type && drive_type.trim() !== ""
                    ? drive_type.trim()
                    : null,
            displacement_cc:
                displacement_cc && displacement_cc !== ""
                    ? parseInt(displacement_cc)
                    : null,
            horsepower_ps:
                horsepower_ps && horsepower_ps !== ""
                    ? parseInt(horsepower_ps)
                    : null,
            torque_nm:
                torque_nm && torque_nm !== "" ? parseInt(torque_nm) : null,
            start_year:
                start_year && start_year !== "" ? parseInt(start_year) : null,
            end_year: end_year && end_year !== "" ? parseInt(end_year) : null,
            market: market && market.trim() !== "" ? market.trim() : null,
            notes: notes && notes.trim() !== "" ? notes.trim() : null,
        };

        if (!sanitizedData.car_model_id || !sanitizedData.trim_name) {
            return res
                .status(400)
                .json({ error: "Car model ID and trim name are required" });
        }

        const trim = await createCarTrim(sanitizedData);
        res.redirect(`/car-trims/${trim.id}`);
    } catch (err) {
        console.error("Create car trim error:", err);
        res.status(500).json({
            error: `Failed to create car trim: ${err.message}`,
        });
    }
}

export async function updateCarTrimHandler(req, res) {
    const { id } = req.params;
    try {
        const {
            car_model_id,
            trim_name,
            engine_code,
            fuel_type,
            transmission,
            drive_type,
            displacement_cc,
            horsepower_ps,
            torque_nm,
            start_year,
            end_year,
            market,
            notes,
        } = req.body;

        const sanitizedData = {
            car_model_id:
                car_model_id && car_model_id.trim() !== ""
                    ? car_model_id.trim()
                    : null,
            trim_name: trim_name?.trim(),
            engine_code:
                engine_code && engine_code.trim() !== ""
                    ? engine_code.trim()
                    : null,
            fuel_type:
                fuel_type && fuel_type.trim() !== "" ? fuel_type.trim() : null,
            transmission:
                transmission && transmission.trim() !== ""
                    ? transmission.trim()
                    : null,
            drive_type:
                drive_type && drive_type.trim() !== ""
                    ? drive_type.trim()
                    : null,
            displacement_cc:
                displacement_cc && displacement_cc !== ""
                    ? parseInt(displacement_cc)
                    : null,
            horsepower_ps:
                horsepower_ps && horsepower_ps !== ""
                    ? parseInt(horsepower_ps)
                    : null,
            torque_nm:
                torque_nm && torque_nm !== "" ? parseInt(torque_nm) : null,
            start_year:
                start_year && start_year !== "" ? parseInt(start_year) : null,
            end_year: end_year && end_year !== "" ? parseInt(end_year) : null,
            market: market && market.trim() !== "" ? market.trim() : null,
            notes: notes && notes.trim() !== "" ? notes.trim() : null,
        };

        if (!sanitizedData.car_model_id || !sanitizedData.trim_name) {
            return res
                .status(400)
                .json({ error: "Car model ID and trim name are required" });
        }

        const trim = await updateCarTrim(id, sanitizedData);
        if (!trim) return res.status(404).json({ error: "Not found" });
        res.redirect(`/car-trims/${id}`);
    } catch (err) {
        console.error("Update car trim error:", err);
        res.status(500).json({
            error: `Failed to update car trim: ${err.message}`,
        });
    }
}

export async function deleteCarTrimHandler(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deleteCarTrim(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.redirect("/car-trims");
    } catch (err) {
        console.error("Delete car trim error:", err);
        res.status(500).json({
            error: `Failed to delete car trim: ${err.message}`,
        });
    }
}
