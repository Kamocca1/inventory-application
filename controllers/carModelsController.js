import { pool } from "../db/pool.js";

export async function listCarModels(req, res) {
    try {
        const { rows } = await pool.query(
            `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
             FROM car_models ORDER BY model_code ASC`
        );
        res.render("car_models/index", { models: rows });
    } catch (err) {
        console.error("List car models error:", err);
        res.status(500).json({ error: "Failed to load car models" });
    }
}

export async function getCarModel(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
             FROM car_models WHERE id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("car_models/detail", { model: rows[0] });
    } catch (err) {
        console.error("Get car model error:", err);
        res.status(500).json({ error: "Failed to load car model" });
    }
}

export function getCarModelForm(req, res) {
    res.render("car_models/create");
}

export async function getCarModelEditForm(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
             FROM car_models WHERE id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("car_models/edit", { model: rows[0] });
    } catch (err) {
        console.error("Get car model edit form error:", err);
        res.status(500).json({ error: "Failed to load car model" });
    }
}

export async function createCarModel(req, res) {
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

        const { rows } = await pool.query(
            `INSERT INTO car_models (series_name, model_code, body_style, market, start_year, end_year, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at`,
            [
                sanitizedData.series_name,
                sanitizedData.model_code,
                sanitizedData.body_style,
                sanitizedData.market,
                sanitizedData.start_year,
                sanitizedData.end_year,
                sanitizedData.notes,
            ]
        );
        res.redirect(`/car-models/${rows[0].id}`);
    } catch (err) {
        console.error("Create car model error:", err);
        res.status(500).json({
            error: `Failed to create car model: ${err.message}`,
        });
    }
}

export async function updateCarModel(req, res) {
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

        const { rows } = await pool.query(
            `UPDATE car_models SET
                series_name=$2, model_code=$3, body_style=$4, market=$5,
                start_year=$6, end_year=$7, notes=$8
             WHERE id=$1
             RETURNING id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at`,
            [
                id,
                sanitizedData.series_name,
                sanitizedData.model_code,
                sanitizedData.body_style,
                sanitizedData.market,
                sanitizedData.start_year,
                sanitizedData.end_year,
                sanitizedData.notes,
            ]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.redirect(`/car-models/${id}`);
    } catch (err) {
        console.error("Update car model error:", err);
        res.status(500).json({
            error: `Failed to update car model: ${err.message}`,
        });
    }
}

export async function deleteCarModel(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query(
            "DELETE FROM car_models WHERE id=$1",
            [id]
        );
        if (rowCount === 0) return res.status(404).json({ error: "Not found" });
        res.redirect("/car-models");
    } catch (err) {
        console.error("Delete car model error:", err);
        res.status(500).json({
            error: `Failed to delete car model: ${err.message}`,
        });
    }
}
