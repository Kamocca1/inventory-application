import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureSchema(client) {
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = await readFile(schemaPath, "utf8");
    await client.query(sql);
}

async function upsertCategory(
    client,
    { name, description = null, parentId = null }
) {
    const result = await client.query(
        `
      INSERT INTO part_categories (name, description, parent_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (parent_id, name)
      DO UPDATE SET description = EXCLUDED.description
      RETURNING id
    `,
        [name, description, parentId]
    );
    return result.rows[0].id;
}

async function upsertModel(client, model) {
    const {
        series_name,
        model_code,
        body_style = null,
        market = null,
        start_year = null,
        end_year = null,
        notes = null,
    } = model;
    const result = await client.query(
        `
      INSERT INTO car_models (series_name, model_code, body_style, market, start_year, end_year, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (model_code)
      DO UPDATE SET series_name = EXCLUDED.series_name,
                    body_style = EXCLUDED.body_style,
                    market = EXCLUDED.market,
                    start_year = COALESCE(car_models.start_year, EXCLUDED.start_year),
                    end_year = COALESCE(EXCLUDED.end_year, car_models.end_year),
                    notes = EXCLUDED.notes
      RETURNING id
    `,
        [
            series_name,
            model_code,
            body_style,
            market,
            start_year,
            end_year,
            notes,
        ]
    );
    return result.rows[0].id;
}

async function upsertTrim(client, trim) {
    const {
        car_model_id,
        trim_name,
        engine_code = null,
        fuel_type = null,
        transmission = null,
        drive_type = null,
        displacement_cc = null,
        horsepower_ps = null,
        torque_nm = null,
        start_year = null,
        end_year = null,
        market = null,
        notes = null,
    } = trim;
    const result = await client.query(
        `
      INSERT INTO car_trims (
        car_model_id, trim_name, engine_code, fuel_type, transmission, drive_type,
        displacement_cc, horsepower_ps, torque_nm, start_year, end_year, market, notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (car_model_id, trim_name, engine_code, start_year)
      DO UPDATE SET fuel_type = EXCLUDED.fuel_type,
                    transmission = EXCLUDED.transmission,
                    drive_type = EXCLUDED.drive_type,
                    displacement_cc = EXCLUDED.displacement_cc,
                    horsepower_ps = EXCLUDED.horsepower_ps,
                    torque_nm = EXCLUDED.torque_nm,
                    end_year = EXCLUDED.end_year,
                    market = EXCLUDED.market,
                    notes = EXCLUDED.notes
      RETURNING id
    `,
        [
            car_model_id,
            trim_name,
            engine_code,
            fuel_type,
            transmission,
            drive_type,
            displacement_cc,
            horsepower_ps,
            torque_nm,
            start_year,
            end_year,
            market,
            notes,
        ]
    );
    return result.rows[0].id;
}

async function upsertPart(client, part) {
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
    } = part;

    const result = await client.query(
        `
      INSERT INTO parts (
        category_id, sku, bmw_oem_number, name, description, brand, supplier,
        price_cents, currency, stock_quantity, min_stock_level, location,
        weight_kg, dimensions_mm, metadata
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (sku)
      DO UPDATE SET bmw_oem_number = COALESCE(EXCLUDED.bmw_oem_number, parts.bmw_oem_number),
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    brand = EXCLUDED.brand,
                    supplier = EXCLUDED.supplier,
                    price_cents = EXCLUDED.price_cents,
                    currency = EXCLUDED.currency,
                    stock_quantity = EXCLUDED.stock_quantity,
                    min_stock_level = EXCLUDED.min_stock_level,
                    location = EXCLUDED.location,
                    weight_kg = EXCLUDED.weight_kg,
                    dimensions_mm = EXCLUDED.dimensions_mm,
                    metadata = EXCLUDED.metadata
      RETURNING id
    `,
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
    return result.rows[0].id;
}

async function seed() {
    const client = await pool.connect();
    try {
        console.log("Applying schema and seeding data...");
        await client.query("BEGIN");

        await ensureSchema(client);

        // Categories
        const engineCatId = await upsertCategory(client, {
            name: "Engine",
            description: "Engine-related parts",
        });
        const brakesCatId = await upsertCategory(client, {
            name: "Brakes",
            description: "Brake system components",
        });
        const filtersCatId = await upsertCategory(client, {
            name: "Filters",
            description: "Air/Oil/Cabin filters",
            parentId: engineCatId,
        });

        // Models
        const f30Id = await upsertModel(client, {
            series_name: "3 Series",
            model_code: "F30",
            body_style: "Sedan",
            market: "Global",
            start_year: 2011,
            end_year: 2019,
            notes: "Sixth generation 3 Series",
        });
        const g30Id = await upsertModel(client, {
            series_name: "5 Series",
            model_code: "G30",
            body_style: "Sedan",
            market: "Global",
            start_year: 2016,
            end_year: 2023,
            notes: "Seventh generation 5 Series",
        });

        // Trims (examples)
        await upsertTrim(client, {
            car_model_id: f30Id,
            trim_name: "330i",
            engine_code: "B48B20",
            fuel_type: "petrol",
            transmission: "automatic",
            drive_type: "rwd",
            displacement_cc: 1998,
            horsepower_ps: 252,
            torque_nm: 350,
            start_year: 2015,
            end_year: 2019,
            market: "Global",
        });
        await upsertTrim(client, {
            car_model_id: f30Id,
            trim_name: "320d",
            engine_code: "N47D20",
            fuel_type: "diesel",
            transmission: "manual",
            drive_type: "rwd",
            displacement_cc: 1995,
            horsepower_ps: 184,
            torque_nm: 380,
            start_year: 2012,
            end_year: 2015,
            market: "EU",
        });
        await upsertTrim(client, {
            car_model_id: g30Id,
            trim_name: "530i",
            engine_code: "B48B20",
            fuel_type: "petrol",
            transmission: "automatic",
            drive_type: "rwd",
            displacement_cc: 1998,
            horsepower_ps: 252,
            torque_nm: 350,
            start_year: 2016,
            end_year: 2020,
            market: "Global",
        });
        await upsertTrim(client, {
            car_model_id: g30Id,
            trim_name: "M5",
            engine_code: "S63B44",
            fuel_type: "petrol",
            transmission: "automatic",
            drive_type: "awd",
            displacement_cc: 4395,
            horsepower_ps: 600,
            torque_nm: 750,
            start_year: 2017,
            end_year: 2020,
            market: "Global",
        });

        // Parts
        await upsertPart(client, {
            category_id: filtersCatId,
            sku: "FIL-B48-001",
            bmw_oem_number: "11427640862",
            name: "Oil Filter - B48",
            description: "Oil filter cartridge for B48 engines",
            brand: "Mahle",
            supplier: "Local Supplier",
            price_cents: 1299,
            currency: "USD",
            stock_quantity: 25,
            min_stock_level: 5,
            location: "Aisle 1 - Bin 3",
            weight_kg: 0.25,
            metadata: { compatible_engines: ["B48B20"], warranty_months: 12 },
        });
        await upsertPart(client, {
            category_id: brakesCatId,
            sku: "BRK-F30-330I-F",
            bmw_oem_number: "34116886527",
            name: "Front Brake Pads - F30 330i",
            description: "Front axle brake pad set",
            brand: "Brembo",
            supplier: "BrakeWorld",
            price_cents: 8999,
            currency: "USD",
            stock_quantity: 12,
            min_stock_level: 2,
            location: "Aisle 3 - Shelf B",
            weight_kg: 2.1,
            metadata: { axle: "front" },
        });
        await upsertPart(client, {
            category_id: filtersCatId,
            sku: "AIR-F30-001",
            bmw_oem_number: "13717601868",
            name: "Engine Air Filter - F30",
            description: "Panel air filter for F30 3 Series",
            brand: "MANN",
            supplier: "AirFlow Co",
            price_cents: 2499,
            currency: "USD",
            stock_quantity: 30,
            min_stock_level: 6,
            location: "Aisle 1 - Bin 7",
            weight_kg: 0.35,
            metadata: { compatible_models: ["F30"] },
        });
        await upsertPart(client, {
            category_id: engineCatId,
            sku: "SPK-B48-PLUG",
            bmw_oem_number: "12120037244",
            name: "Spark Plug - B48",
            description: "Iridium spark plug for B48 engines",
            brand: "NGK",
            supplier: "Ignite Parts",
            price_cents: 1599,
            currency: "USD",
            stock_quantity: 80,
            min_stock_level: 20,
            location: "Aisle 2 - Bin 5",
            weight_kg: 0.06,
            metadata: { heat_range: "6" },
        });

        await client.query("COMMIT");
        console.log("Seeding complete.");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Seed failed:", err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    seed().catch(() => process.exit(1));
}

export { seed };
