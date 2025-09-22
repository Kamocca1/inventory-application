import { pool } from "../db/pool.js";

export async function listCarModels(req, res) {
    try {
        const { rows } = await pool.query(
            `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
             FROM car_models ORDER BY model_code ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch car models" });
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
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch car model" });
    }
}

export async function createCarModel(req, res) {
    const {
        series_name,
        model_code,
        body_style = null,
        market = null,
        start_year = null,
        end_year = null,
        notes = null,
    } = req.body ?? {};
    try {
        const { rows } = await pool.query(
            `INSERT INTO car_models (series_name, model_code, body_style, market, start_year, end_year, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at`,
            [
                series_name,
                model_code,
                body_style,
                market,
                start_year,
                end_year,
                notes,
            ]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to create car model" });
    }
}

export async function updateCarModel(req, res) {
    const { id } = req.params;
    const {
        series_name,
        model_code,
        body_style = null,
        market = null,
        start_year = null,
        end_year = null,
        notes = null,
    } = req.body ?? {};
    try {
        const { rows } = await pool.query(
            `UPDATE car_models SET
                series_name=$2, model_code=$3, body_style=$4, market=$5,
                start_year=$6, end_year=$7, notes=$8
             WHERE id=$1
             RETURNING id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at`,
            [
                id,
                series_name,
                model_code,
                body_style,
                market,
                start_year,
                end_year,
                notes,
            ]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to update car model" });
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
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete car model" });
    }
}
