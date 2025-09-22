import { pool } from "../db/pool.js";

export async function listCarTrims(req, res) {
    try {
        const { rows } = await pool.query(
            `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                    displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                    created_at, updated_at
             FROM car_trims ORDER BY trim_name ASC`
        );
        res.json(rows);
    } catch (err) {
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
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch car trim" });
    }
}

export async function createCarTrim(req, res) {
    const {
        car_model_id,
        trim_name,
        engine_code = null,
        fuel_type = null,
        transmission = null,
        drive_type = null,
        displacement_cc = null,
        horsepower_ps = null,
        torque_nm = null,
        start_year = null,
        end_year = null,
        market = null,
        notes = null,
    } = req.body ?? {};
    try {
        const { rows } = await pool.query(
            `INSERT INTO car_trims (
                car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes
             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                       displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                       created_at, updated_at`,
            [
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
            ]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to create car trim" });
    }
}

export async function updateCarTrim(req, res) {
    const { id } = req.params;
    const {
        car_model_id,
        trim_name,
        engine_code = null,
        fuel_type = null,
        transmission = null,
        drive_type = null,
        displacement_cc = null,
        horsepower_ps = null,
        torque_nm = null,
        start_year = null,
        end_year = null,
        market = null,
        notes = null,
    } = req.body ?? {};
    try {
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
            ]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to update car trim" });
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
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete car trim" });
    }
}
