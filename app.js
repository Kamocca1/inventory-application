import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import partCategoriesRoutes from "./routes/partCategoriesRoutes.js";
import partsRoutes from "./routes/partsRoutes.js";
import carModelsRoutes from "./routes/carModelsRoutes.js";
import carTrimsRoutes from "./routes/carTrimsRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/part-categories", partCategoriesRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/car-models", carModelsRoutes);
app.use("/api/car-trims", carTrimsRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Inventory API" });
});

export default app;
