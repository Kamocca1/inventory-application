import { pool } from "../config/pool.js";

/**
 * Retrieves all parts from the database ordered by name in ascending order.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of part objects.
 * Each part object contains: id, category_id, sku, bmw_oem_number, name, description,
 * brand, supplier, price_cents, currency, stock_quantity, min_stock_level, location,
 * weight_kg, dimensions_mm, metadata, created_at, updated_at
 */
export async function findAllParts() {
    const { rows } = await pool.query(
        `SELECT id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                price_cents, currency, stock_quantity, min_stock_level, location,
                weight_kg, dimensions_mm, metadata, created_at, updated_at
         FROM parts ORDER BY name ASC`
    );
    return rows;
}

/**
 * Retrieves a single part from the database by its ID.
 *
 * @param {number} id - The unique identifier of the part to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to a part object if found, or null if not found.
 * The part object contains: id, category_id, sku, bmw_oem_number, name, description,
 * brand, supplier, price_cents, currency, stock_quantity, min_stock_level, location,
 * weight_kg, dimensions_mm, metadata, created_at, updated_at
 */
export async function findPartById(id) {
    const { rows } = await pool.query(
        `SELECT id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                price_cents, currency, stock_quantity, min_stock_level, location,
                weight_kg, dimensions_mm, metadata, created_at, updated_at
         FROM parts WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Creates a new part in the database.
 *
 * @param {Object} partData - The part data object containing all part properties.
 * @param {number} partData.category_id - The category ID for the part.
 * @param {string} partData.sku - The SKU (Stock Keeping Unit) for the part.
 * @param {string} partData.bmw_oem_number - The BMW OEM number for the part.
 * @param {string} partData.name - The name of the part.
 * @param {string} partData.description - The description of the part.
 * @param {string} partData.brand - The brand of the part.
 * @param {string} partData.supplier - The supplier of the part.
 * @param {number} partData.price_cents - The price in cents.
 * @param {string} partData.currency - The currency code.
 * @param {number} partData.stock_quantity - The current stock quantity.
 * @param {number} partData.min_stock_level - The minimum stock level.
 * @param {string} partData.location - The storage location of the part.
 * @param {number} partData.weight_kg - The weight in kilograms.
 * @param {string} partData.dimensions_mm - The dimensions in millimeters.
 * @param {Object} partData.metadata - Additional metadata for the part.
 * @returns {Promise<Object>} A promise that resolves to the created part object with all fields including id, created_at, and updated_at.
 */
export async function createPart(partData) {
    const {
        category_id,
        sku,
        bmw_oem_number,
        name,
        description,
        brand,
        supplier,
        price_cents,
        currency,
        stock_quantity,
        min_stock_level,
        location,
        weight_kg,
        dimensions_mm,
        metadata,
    } = partData;

    const { rows } = await pool.query(
        `INSERT INTO parts (
            category_id, sku, bmw_oem_number, name, description, brand, supplier,
            price_cents, currency, stock_quantity, min_stock_level, location,
            weight_kg, dimensions_mm, metadata
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                   price_cents, currency, stock_quantity, min_stock_level, location,
                   weight_kg, dimensions_mm, metadata, created_at, updated_at`,
        [
            category_id,
            sku,
            bmw_oem_number,
            name,
            description,
            brand,
            supplier,
            price_cents,
            currency,
            stock_quantity,
            min_stock_level,
            location,
            weight_kg,
            dimensions_mm,
            metadata,
        ]
    );
    return rows[0];
}

/**
 * Updates an existing part in the database.
 *
 * @param {number} id - The unique identifier of the part to update.
 * @param {Object} partData - The part data object containing updated part properties.
 * @param {number} partData.category_id - The category ID for the part.
 * @param {string} partData.sku - The SKU (Stock Keeping Unit) for the part.
 * @param {string} partData.bmw_oem_number - The BMW OEM number for the part.
 * @param {string} partData.name - The name of the part.
 * @param {string} partData.description - The description of the part.
 * @param {string} partData.brand - The brand of the part.
 * @param {string} partData.supplier - The supplier of the part.
 * @param {number} partData.price_cents - The price in cents.
 * @param {string} partData.currency - The currency code.
 * @param {number} partData.stock_quantity - The current stock quantity.
 * @param {number} partData.min_stock_level - The minimum stock level.
 * @param {string} partData.location - The storage location of the part.
 * @param {number} partData.weight_kg - The weight in kilograms.
 * @param {string} partData.dimensions_mm - The dimensions in millimeters.
 * @param {Object} partData.metadata - Additional metadata for the part.
 * @returns {Promise<Object|null>} A promise that resolves to the updated part object if found and updated, or null if not found.
 */
export async function updatePart(id, partData) {
    const {
        category_id,
        sku,
        bmw_oem_number,
        name,
        description,
        brand,
        supplier,
        price_cents,
        currency,
        stock_quantity,
        min_stock_level,
        location,
        weight_kg,
        dimensions_mm,
        metadata,
    } = partData;

    const { rows } = await pool.query(
        `UPDATE parts SET
            category_id=$2, sku=$3, bmw_oem_number=$4, name=$5, description=$6, brand=$7, supplier=$8,
            price_cents=$9, currency=$10, stock_quantity=$11, min_stock_level=$12, location=$13,
            weight_kg=$14, dimensions_mm=$15, metadata=$16
         WHERE id=$1
         RETURNING id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                   price_cents, currency, stock_quantity, min_stock_level, location,
                   weight_kg, dimensions_mm, metadata, created_at, updated_at`,
        [
            id,
            category_id,
            sku,
            bmw_oem_number,
            name,
            description,
            brand,
            supplier,
            price_cents,
            currency,
            stock_quantity,
            min_stock_level,
            location,
            weight_kg,
            dimensions_mm,
            metadata,
        ]
    );
    return rows[0] || null;
}

/**
 * Deletes a part from the database by its ID.
 *
 * @param {number} id - The unique identifier of the part to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the part was successfully deleted, false if no part was found with the given ID.
 */
export async function deletePart(id) {
    const { rowCount } = await pool.query("DELETE FROM parts WHERE id=$1", [
        id,
    ]);
    return rowCount > 0;
}
