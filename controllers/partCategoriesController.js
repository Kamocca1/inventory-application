import { pool } from "../db/pool.js";

export async function listPartCategories(req, res) {
    try {
        const { rows } = await pool.query(
            "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories ORDER BY name ASC"
        );
        res.render("part_categories/index", { categories: rows });
    } catch (err) {
        console.error("List part categories error:", err);
        res.status(500).json({ error: "Failed to load part categories" });
    }
}

export async function getPartCategory(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories WHERE id = $1",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("part_categories/detail", { category: rows[0] });
    } catch (err) {
        console.error("Get part category error:", err);
        res.status(500).json({ error: "Failed to load part category" });
    }
}

export function getPartCategoryForm(req, res) {
    res.render("part_categories/create");
}

export async function getPartCategoryEditForm(req, res) {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories WHERE id = $1",
            [id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("part_categories/edit", { category: rows[0] });
    } catch (err) {
        console.error("Get part category edit form error:", err);
        res.status(500).json({ error: "Failed to load part category" });
    }
}

export async function createPartCategory(req, res) {
    try {
        const { name, description, parent_id } = req.body;

        const sanitizedData = {
            name: name?.trim(),
            description:
                description && description.trim() !== ""
                    ? description.trim()
                    : null,
            parent_id:
                parent_id && parent_id.trim() !== "" ? parent_id.trim() : null,
        };

        if (!sanitizedData.name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const { rows } = await pool.query(
            `INSERT INTO part_categories (name, description, parent_id)
             VALUES ($1, $2, $3)
             RETURNING id, name, description, parent_id, created_at, updated_at`,
            [
                sanitizedData.name,
                sanitizedData.description,
                sanitizedData.parent_id,
            ]
        );
        res.redirect(`/part-categories/${rows[0].id}`);
    } catch (err) {
        console.error("Create part category error:", err);
        res.status(500).json({
            error: `Failed to create part category: ${err.message}`,
        });
    }
}

export async function updatePartCategory(req, res) {
    const { id } = req.params;
    try {
        const { name, description, parent_id } = req.body;

        const sanitizedData = {
            name: name?.trim(),
            description:
                description && description.trim() !== ""
                    ? description.trim()
                    : null,
            parent_id:
                parent_id && parent_id.trim() !== "" ? parent_id.trim() : null,
        };

        if (!sanitizedData.name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const { rows } = await pool.query(
            `UPDATE part_categories
             SET name = $2, description = $3, parent_id = $4
             WHERE id = $1
             RETURNING id, name, description, parent_id, created_at, updated_at`,
            [
                id,
                sanitizedData.name,
                sanitizedData.description,
                sanitizedData.parent_id,
            ]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.redirect(`/part-categories/${id}`);
    } catch (err) {
        console.error("Update part category error:", err);
        res.status(500).json({
            error: `Failed to update part category: ${err.message}`,
        });
    }
}

export async function deletePartCategory(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query(
            "DELETE FROM part_categories WHERE id = $1",
            [id]
        );
        if (rowCount === 0) return res.status(404).json({ error: "Not found" });
        res.redirect("/part-categories");
    } catch (err) {
        console.error("Delete part category error:", err);
        res.status(500).json({
            error: `Failed to delete part category: ${err.message}`,
        });
    }
}
