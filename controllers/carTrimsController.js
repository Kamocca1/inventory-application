import { pool } from "../db/pool.js";

export async function listCarTrims(req, res) {
    try {
        const { rows } = await pool.query(
            `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                    displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                    created_at, updated_at
             FROM car_trims ORDER BY trim_name ASC`
        );
        res.render("car_trims/index", { trims: rows });
    } catch (err) {
        console.error("List car trims error:", err);
        res.status(500).json({ error: "Failed to fetch car trims" });
    }
}

export async function getCarTrim(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                    displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                    created_at, updated_at
             FROM car_trims WHERE id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("car_trims/detail", { trim: rows[0] });
    } catch (err) {
        console.error("Get car trim error:", err);
        res.status(500).json({ error: "Failed to load car trim" });
    }
}

export function getCarTrimForm(req, res) {
    res.render("car_trims/create");
}

export async function getCarTrimEditForm(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                    displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                    created_at, updated_at
             FROM car_trims WHERE id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("car_trims/edit", { trim: rows[0] });
    } catch (err) {
        console.error("Get car trim edit form error:", err);
        res.status(500).json({ error: "Failed to load car trim" });
    }
}

export async function createCarTrim(req, res) {
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

        const { rows } = await pool.query(
            `INSERT INTO car_trims (
                car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes
             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                       displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                       created_at, updated_at`,
            [
                sanitizedData.car_model_id,
                sanitizedData.trim_name,
                sanitizedData.engine_code,
                sanitizedData.fuel_type,
                sanitizedData.transmission,
                sanitizedData.drive_type,
                sanitizedData.displacement_cc,
                sanitizedData.horsepower_ps,
                sanitizedData.torque_nm,
                sanitizedData.start_year,
                sanitizedData.end_year,
                sanitizedData.market,
                sanitizedData.notes,
            ]
        );
        res.redirect(`/car-trims/${rows[0].id}`);
    } catch (err) {
        console.error("Create car trim error:", err);
        res.status(500).json({
            error: `Failed to create car trim: ${err.message}`,
        });
    }
}

export async function updateCarTrim(req, res) {
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

        const { rows } = await pool.query(
            `UPDATE car_trims SET
                car_model_id=$2, trim_name=$3, engine_code=$4, fuel_type=$5, transmission=$6, drive_type=$7,
                displacement_cc=$8, horsepower_ps=$9, torque_nm=$10, start_year=$11, end_year=$12, market=$13, notes=$14
             WHERE id=$1
             RETURNING id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                       displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                       created_at, updated_at`,
            [
                id,
                sanitizedData.car_model_id,
                sanitizedData.trim_name,
                sanitizedData.engine_code,
                sanitizedData.fuel_type,
                sanitizedData.transmission,
                sanitizedData.drive_type,
                sanitizedData.displacement_cc,
                sanitizedData.horsepower_ps,
                sanitizedData.torque_nm,
                sanitizedData.start_year,
                sanitizedData.end_year,
                sanitizedData.market,
                sanitizedData.notes,
            ]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.redirect(`/car-trims/${id}`);
    } catch (err) {
        console.error("Update car trim error:", err);
        res.status(500).json({
            error: `Failed to update car trim: ${err.message}`,
        });
    }
}

export async function deleteCarTrim(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query(
            "DELETE FROM car_trims WHERE id=$1",
            [id]
        );
        if (rowCount === 0) return res.status(404).json({ error: "Not found" });
        res.redirect("/car-trims");
    } catch (err) {
        console.error("Delete car trim error:", err);
        res.status(500).json({
            error: `Failed to delete car trim: ${err.message}`,
        });
    }
}
