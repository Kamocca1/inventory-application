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
        res.render("parts/detail", { part: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part" });
    }
}

export function getPartForm(req, res) {
    res.render("parts/create");
}

export async function getPartEditForm(req, res) {
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
        res.render("parts/edit", { part: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part" });
    }
}

export async function createPart(req, res) {
    try {
        const {
            category_id,
            sku,
            bmw_oem_number,
            name,
            description,
            brand,
            supplier,
            price_cents,
            currency = "USD",
            stock_quantity,
            min_stock_level,
            location,
            weight_kg,
            dimensions_mm,
            metadata,
        } = req.body;

        // Sanitize and convert data - properly handle empty strings for UUID fields
        const sanitizedData = {
            category_id:
                category_id &&
                category_id.trim() !== "" &&
                category_id.trim() !== "null"
                    ? category_id.trim()
                    : null,
            sku: sku?.trim(),
            bmw_oem_number:
                bmw_oem_number && bmw_oem_number.trim() !== ""
                    ? bmw_oem_number.trim()
                    : null,
            name: name?.trim(),
            description:
                description && description.trim() !== ""
                    ? description.trim()
                    : null,
            brand: brand && brand.trim() !== "" ? brand.trim() : null,
            supplier:
                supplier && supplier.trim() !== "" ? supplier.trim() : null,
            price_cents:
                price_cents && price_cents !== ""
                    ? parseInt(price_cents)
                    : null,
            currency: currency || "USD",
            stock_quantity:
                stock_quantity && stock_quantity !== ""
                    ? parseInt(stock_quantity)
                    : 0,
            min_stock_level:
                min_stock_level && min_stock_level !== ""
                    ? parseInt(min_stock_level)
                    : 0,
            location:
                location && location.trim() !== "" ? location.trim() : null,
            weight_kg:
                weight_kg && weight_kg !== "" ? parseFloat(weight_kg) : null,
            dimensions_mm: null,
            metadata: null,
        };

        // Parse JSON fields safely
        if (dimensions_mm && dimensions_mm.trim() !== "") {
            try {
                sanitizedData.dimensions_mm = JSON.parse(dimensions_mm);
            } catch (e) {
                return res
                    .status(400)
                    .json({ error: "Invalid JSON format in dimensions" });
            }
        }

        if (metadata && metadata.trim() !== "") {
            try {
                sanitizedData.metadata = JSON.parse(metadata);
            } catch (e) {
                return res
                    .status(400)
                    .json({ error: "Invalid JSON format in metadata" });
            }
        }

        // Validate required fields
        if (!sanitizedData.sku || !sanitizedData.name) {
            return res.status(400).json({ error: "SKU and Name are required" });
        }

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
                sanitizedData.category_id,
                sanitizedData.sku,
                sanitizedData.bmw_oem_number,
                sanitizedData.name,
                sanitizedData.description,
                sanitizedData.brand,
                sanitizedData.supplier,
                sanitizedData.price_cents,
                sanitizedData.currency,
                sanitizedData.stock_quantity,
                sanitizedData.min_stock_level,
                sanitizedData.location,
                sanitizedData.weight_kg,
                sanitizedData.dimensions_mm,
                sanitizedData.metadata,
            ]
        );
        res.redirect(`/parts/${rows[0].id}`);
    } catch (err) {
        console.error("Create part error:", err);
        res.status(500).json({
            error: `Failed to create part: ${err.message}`,
        });
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
        res.redirect(`/parts/${id}`);
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
        res.redirect("/parts");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete part" });
    }
}
