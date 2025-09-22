import { pool } from "../db/pool.js";

export async function listParts(req, res) {
    try {
        const { rows } = await pool.query(
            `SELECT id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                    price_cents, currency, stock_quantity, min_stock_level, location,
                    weight_kg, dimensions_mm, metadata, created_at, updated_at
             FROM parts ORDER BY name ASC`
        );
        res.render("parts/index", { parts: rows });
    } catch (err) {
        res.status(500).json({ error: "Failed to load parts" });
    }
}

export async function getPart(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            `SELECT id, category_id, sku, bmw_oem_number, name, description, brand, supplier,
                    price_cents, currency, stock_quantity, min_stock_level, location,
                    weight_kg, dimensions_mm, metadata, created_at, updated_at
             FROM parts WHERE id = $1`,
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("part/index", { part: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part" });
    }
}

export async function createPart(req, res) {
    const {
        category_id = null,
        sku,
        bmw_oem_number = null,
        name,
        description = null,
        brand = null,
        supplier = null,
        price_cents = null,
        currency = "USD",
        stock_quantity = 0,
        min_stock_level = 0,
        location = null,
        weight_kg = null,
        dimensions_mm = null,
        metadata = null,
    } = req.body ?? {};

    try {
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
        res.status(201).render("part/index", { part: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to create part" });
    }
}

export async function updatePart(req, res) {
    const { id } = req.params;
    const {
        category_id = null,
        sku,
        bmw_oem_number = null,
        name,
        description = null,
        brand = null,
        supplier = null,
        price_cents = null,
        currency = "USD",
        stock_quantity = 0,
        min_stock_level = 0,
        location = null,
        weight_kg = null,
        dimensions_mm = null,
        metadata = null,
    } = req.body ?? {};
    try {
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
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("part/index", { part: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to update part" });
    }
}

export async function deletePart(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query("DELETE FROM parts WHERE id=$1", [
            id,
        ]);
        if (rowCount === 0) return res.status(404).json({ error: "Not found" });
        res.status(204).send().render("parts/index", { parts: rows });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete part" });
    }
}
