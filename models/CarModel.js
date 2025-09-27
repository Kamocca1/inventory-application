import { pool } from "../config/pool.js";

/**
 * Retrieves all car models from the database ordered by model code in ascending order.
 *
 * @returns {Promise<Array<{
 *   id: number,
 *   series_name: string,
 *   model_code: string,
 *   body_style: string|null,
 *   market: string|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>>} A promise that resolves to an array of car model objects
 */
export async function findAllCarModels() {
    const { rows } = await pool.query(
        `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
         FROM car_models ORDER BY model_code ASC`
    );
    return rows;
}

/**
 * Retrieves a single car model from the database by its ID.
 *
 * @param {number} id - The unique identifier of the car model to retrieve.
 * @returns {Promise<{
 *   id: number,
 *   series_name: string,
 *   model_code: string,
 *   body_style: string|null,
 *   market: string|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to a car model object if found, or null if not found
 */
export async function findCarModelById(id) {
    const { rows } = await pool.query(
        `SELECT id, series_name, model_code, body_style, market, start_year, end_year, notes, created_at, updated_at
         FROM car_models WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Creates a new car model in the database.
 *
 * @param {Object} modelData - The car model data to create.
 * @returns {Promise<{
 *   id: number,
 *   series_name: string,
 *   model_code: string,
 *   body_style: string|null,
 *   market: string|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>} A promise that resolves to the created car model object
 */
export async function createCarModel(modelData) {
    const {
        series_name,
        model_code,
        body_style,
        market,
        start_year,
        end_year,
        notes,
    } = modelData;

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
    return rows[0];
}

/**
 * Updates an existing car model in the database.
 *
 * @param {number} id - The unique identifier of the car model to update.
 * @param {Object} modelData - The updated car model data.
 * @returns {Promise<{
 *   id: number,
 *   series_name: string,
 *   model_code: string,
 *   body_style: string|null,
 *   market: string|null,
 *   start_year: number|null,
 *   end_year: number|null,
 *   notes: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to the updated car model object if found, or null if not found
 */
export async function updateCarModel(id, modelData) {
    const {
        series_name,
        model_code,
        body_style,
        market,
        start_year,
        end_year,
        notes,
    } = modelData;

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
    return rows[0] || null;
}

/**
 * Deletes a car model from the database.
 *
 * @param {number} id - The unique identifier of the car model to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the car model was deleted, false if not found
 */
export async function deleteCarModel(id) {
    const { rowCount } = await pool.query(
        "DELETE FROM car_models WHERE id=$1",
        [id]
    );
    return rowCount > 0;
}
