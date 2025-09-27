import { pool } from "../config/pool.js";

/**
 * Retrieves all part categories from the database ordered by name in ascending order.
 *
 * @returns {Promise<Array<{
 *   id: number,
 *   name: string,
 *   description: string|null,
 *   parent_id: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>>} A promise that resolves to an array of part category objects
 */
export async function findAllPartCategories() {
    const { rows } = await pool.query(
        "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories ORDER BY name ASC"
    );
    return rows;
}

/**
 * Retrieves a single part category from the database by its ID.
 *
 * @param {number} id - The unique identifier of the part category to retrieve.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   description: string|null,
 *   parent_id: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to a part category object if found, or null if not found
 */
export async function findPartCategoryById(id) {
    const { rows } = await pool.query(
        "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories WHERE id = $1",
        [id]
    );
    return rows[0] || null;
}

/**
 * Creates a new part category in the database.
 *
 * @param {Object} categoryData - The part category data to create.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   description: string|null,
 *   parent_id: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }>} A promise that resolves to the created part category object
 */
export async function createPartCategory(categoryData) {
    const { name, description, parent_id } = categoryData;

    const { rows } = await pool.query(
        `INSERT INTO part_categories (name, description, parent_id)
         VALUES ($1, $2, $3)
         RETURNING id, name, description, parent_id, created_at, updated_at`,
        [name, description, parent_id]
    );
    return rows[0];
}

/**
 * Updates an existing part category in the database.
 *
 * @param {number} id - The unique identifier of the part category to update.
 * @param {Object} categoryData - The updated part category data.
 * @returns {Promise<{
 *   id: number,
 *   name: string,
 *   description: string|null,
 *   parent_id: string|null,
 *   created_at: Date,
 *   updated_at: Date
 * }|null>} A promise that resolves to the updated part category object if found, or null if not found
 */
export async function updatePartCategory(id, categoryData) {
    const { name, description, parent_id } = categoryData;

    const { rows } = await pool.query(
        `UPDATE part_categories
         SET name = $2, description = $3, parent_id = $4
         WHERE id = $1
         RETURNING id, name, description, parent_id, created_at, updated_at`,
        [id, name, description, parent_id]
    );
    return rows[0] || null;
}

/**
 * Deletes a part category from the database.
 *
 * @param {number} id - The unique identifier of the part category to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the part category was deleted, false if not found
 */
export async function deletePartCategory(id) {
    const { rowCount } = await pool.query(
        "DELETE FROM part_categories WHERE id = $1",
        [id]
    );
    return rowCount > 0;
}
