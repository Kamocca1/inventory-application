import { pool } from "../config/pool.js";

/**
 * Retrieves all car trims from the database ordered by trim name in ascending order.
 *
 * @returns {Promise<Array<{
 *   id: number,
 *   car_model_id: string,
 *   trim_name: string,
 *   engine_code: string|null,
 *   fuel_type: string|null,
 *   transmission: string|null,
 *   drive_type: string|null,
 *   displacement_cc: number|null,
 *   horsepower_ps: number|null,
 *   torque_nm: number|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   market: string|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>>} A promise that resolves to an array of car trim objects
 */
export async function findAllCarTrims() {
    const { rows } = await pool.query(
        `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                created_at, updated_at
         FROM car_trims ORDER BY trim_name ASC`
    );
    return rows;
}

/**
 * Retrieves a single car trim from the database by its ID.
 *
 * @param {number} id - The unique identifier of the car trim to retrieve.
 * @returns {Promise<{
 *   id: number,
 *   car_model_id: string,
 *   trim_name: string,
 *   engine_code: string|null,
 *   fuel_type: string|null,
 *   transmission: string|null,
 *   drive_type: string|null,
 *   displacement_cc: number|null,
 *   horsepower_ps: number|null,
 *   torque_nm: number|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   market: string|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to a car trim object if found, or null if not found
 */
export async function findCarTrimById(id) {
    const { rows } = await pool.query(
        `SELECT id, car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
                displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes,
                created_at, updated_at
         FROM car_trims WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Creates a new car trim in the database.
 *
 * @param {Object} trimData - The car trim data to create.
 * @returns {Promise<{
 *   id: number,
 *   car_model_id: string,
 *   trim_name: string,
 *   engine_code: string|null,
 *   fuel_type: string|null,
 *   transmission: string|null,
 *   drive_type: string|null,
 *   displacement_cc: number|null,
 *   horsepower_ps: number|null,
 *   torque_nm: number|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   market: string|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>} A promise that resolves to the created car trim object
 */
export async function createCarTrim(trimData) {
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
    } = trimData;

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
    return rows[0];
}

/**
 * Updates an existing car trim in the database.
 *
 * @param {number} id - The unique identifier of the car trim to update.
 * @param {Object} trimData - The updated car trim data.
 * @returns {Promise<{
 *   id: number,
 *   car_model_id: string,
 *   trim_name: string,
 *   engine_code: string|null,
 *   fuel_type: string|null,
 *   transmission: string|null,
 *   drive_type: string|null,
 *   displacement_cc: number|null,
 *   horsepower_ps: number|null,
 *   torque_nm: number|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   market: string|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to the updated car trim object if found, or null if not found
 */
export async function updateCarTrim(id, trimData) {
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
    } = trimData;

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
    return rows[0] || null;
}

/**
 * Deletes a car trim from the database.
 *
 * @param {number} id - The unique identifier of the car trim to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the car trim was deleted, false if not found
 */
export async function deleteCarTrim(id) {
    const { rowCount } = await pool.query("DELETE FROM car_trims WHERE id=$1", [
        id,
    ]);
    return rowCount > 0;
}
