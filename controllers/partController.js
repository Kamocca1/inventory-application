import {
    findAllParts,
    findPartById,
    createPart,
    updatePart,
    deletePart,
} from "../models/Part.js";

export async function listPartsHandler(req, res) {
    try {
        const parts = await findAllParts();
        res.render("parts/index", { parts });
    } catch (err) {
        res.status(500).json({ error: "Failed to load parts" });
    }
}

export async function getPartHandler(req, res) {
    const { id } = req.params;
    try {
        const part = await findPartById(id);
        if (!part) return res.status(404).json({ error: "Not found" });
        res.render("parts/detail", { part });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part" });
    }
}

export function getPartFormHandler(req, res) {
    res.render("parts/create");
}

export async function getPartEditFormHandler(req, res) {
    const { id } = req.params;
    try {
        const part = await findPartById(id);
        if (!part) return res.status(404).json({ error: "Not found" });
        res.render("parts/edit", { part });
    } catch (err) {
        res.status(500).json({ error: "Failed to load part" });
    }
}

export async function createPartHandler(req, res) {
    try {
        // sanitizedData is provided by the sanitizePartData middleware
        const part = await createPart(req.sanitizedData);
        res.redirect(`/parts/${part.id}`);
    } catch (err) {
        console.error("Create part error:", err);
        res.status(500).json({
            error: `Failed to create part: ${err.message}`,
        });
    }
}

export async function updatePartHandler(req, res) {
    const { id } = req.params;
    try {
        // sanitizedData is provided by the sanitizePartData middleware
        const part = await updatePart(id, req.sanitizedData);
        if (!part) return res.status(404).json({ error: "Not found" });
        res.redirect(`/parts/${id}`);
    } catch (err) {
        res.status(500).json({ error: "Failed to update part" });
    }
}

export async function deletePartHandler(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deletePart(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.redirect("/parts");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete part" });
    }
}
