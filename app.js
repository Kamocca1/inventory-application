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

app.use(["/", "/parts"], partsRoutes);
app.use("/part-categories", partCategoriesRoutes);
app.use("/car-models", carModelsRoutes);
app.use("/car-trims", carTrimsRoutes);

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Inventory app - listening on port ${PORT}!`);
});

// export default app;
