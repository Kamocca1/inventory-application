import {
    findAllPartCategories,
    findPartCategoryById,
    createPartCategory,
    updatePartCategory,
    deletePartCategory,
} from "../models/PartCategory.js";

export async function listPartCategoriesHandler(req, res) {
    try {
        const categories = await findAllPartCategories();
        res.render("part_categories/index", { categories });
    } catch (err) {
        console.error("List part categories error:", err);
        res.status(500).json({ error: "Failed to load part categories" });
    }
}

export async function getPartCategoryHandler(req, res) {
    const { id } = req.params;
    try {
        const category = await findPartCategoryById(id);
        if (!category) return res.status(404).json({ error: "Not found" });
        res.render("part_categories/detail", { category });
    } catch (err) {
        console.error("Get part category error:", err);
        res.status(500).json({ error: "Failed to load part category" });
    }
}

export function getPartCategoryFormHandler(req, res) {
    res.render("part_categories/create");
}

export async function getPartCategoryEditFormHandler(req, res) {
    const { id } = req.params;
    try {
        const category = await findPartCategoryById(id);
        if (!category) return res.status(404).json({ error: "Not found" });
        res.render("part_categories/edit", { category });
    } catch (err) {
        console.error("Get part category edit form error:", err);
        res.status(500).json({ error: "Failed to load part category" });
    }
}

export async function createPartCategoryHandler(req, res) {
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

        const category = await createPartCategory(sanitizedData);
        res.redirect(`/part-categories/${category.id}`);
    } catch (err) {
        console.error("Create part category error:", err);
        res.status(500).json({
            error: `Failed to create part category: ${err.message}`,
        });
    }
}

export async function updatePartCategoryHandler(req, res) {
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

        const category = await updatePartCategory(id, sanitizedData);
        if (!category) return res.status(404).json({ error: "Not found" });
        res.redirect(`/part-categories/${id}`);
    } catch (err) {
        console.error("Update part category error:", err);
        res.status(500).json({
            error: `Failed to update part category: ${err.message}`,
        });
    }
}

export async function deletePartCategoryHandler(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deletePartCategory(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.redirect("/part-categories");
    } catch (err) {
        console.error("Delete part category error:", err);
        res.status(500).json({
            error: `Failed to delete part category: ${err.message}`,
        });
    }
}
