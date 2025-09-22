import { pool } from "../db/pool.js";

export async function listPartCategories(req, res) {
    try {
        const { rows } = await pool.query(
            "SELECT id, name, description, parent_id, created_at, updated_at FROM part_categories ORDER BY name ASC"
        );
        res.render("part_categories/index", { categories: rows });
    } catch (err) {
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
        res.render("part_categories/index", { categories: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part category" });
    }
}

export function getPartCategoryForm(req, res) {
    res.render("part_categories/create");
}

export async function createPartCategory(req, res) {
    const { name, description = null, parent_id = null } = req.body ?? {};
    try {
        const { rows } = await pool.query(
            `INSERT INTO part_categories (name, description, parent_id)
             VALUES ($1, $2, $3)
             RETURNING id, name, description, parent_id, created_at, updated_at`,
            [name, description, parent_id]
        );
        res.status(201).render("part_categories/index", {
            categories: rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to create part category" });
    }
}

export async function updatePartCategory(req, res) {
    const { id } = req.params;
    const { name, description = null, parent_id = null } = req.body ?? {};
    try {
        const { rows } = await pool.query(
            `UPDATE part_categories
             SET name = $2,
                 description = $3,
                 parent_id = $4
             WHERE id = $1
             RETURNING id, name, description, parent_id, created_at, updated_at`,
            [id, name, description, parent_id]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found" });
        res.render("part_categories/index", { categories: rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Failed to update part category" });
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
        res.status(204)
            .send()
            .render("part_categories/index", { categories: rows });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete part category" });
    }
}
