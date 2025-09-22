-- PostgreSQL schema for BMW car parts inventory
-- Tables: part_categories, parts, car_models, car_trims
-- Safe to run multiple times (idempotent-ish): uses IF NOT EXISTS where supported.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fuel_type_enum') THEN
    CREATE TYPE fuel_type_enum AS ENUM ('petrol', 'diesel', 'hybrid', 'electric');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transmission_enum') THEN
    CREATE TYPE transmission_enum AS ENUM ('manual', 'automatic', 'dual_clutch');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'drive_type_enum') THEN
    CREATE TYPE drive_type_enum AS ENUM ('rwd', 'awd', 'fwd');
  END IF;
END$$;

-- Timestamp utility: updated_at auto-refresh
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- part_categories: hierarchical categories for parts (e.g., Engine, Brakes, Filters)
CREATE TABLE IF NOT EXISTS part_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_part_categories_parent_name UNIQUE (parent_id, name),
  CONSTRAINT fk_part_categories_parent
    FOREIGN KEY (parent_id)
    REFERENCES part_categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_part_categories_parent ON part_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_part_categories_name ON part_categories(name);

DROP TRIGGER IF EXISTS trg_part_categories_set_updated_at ON part_categories;
CREATE TRIGGER trg_part_categories_set_updated_at
BEFORE UPDATE ON part_categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE part_categories IS 'Hierarchical categories for parts. Supports parent-child nesting.';
COMMENT ON COLUMN part_categories.name IS 'Category display name (unique per parent).';

-- car_models: BMW platforms/generations (e.g., 3 Series F30, 5 Series G30)
CREATE TABLE IF NOT EXISTS car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_name TEXT NOT NULL,            -- e.g., "3 Series", "5 Series"
  model_code TEXT NOT NULL,             -- e.g., E90, F30, G20
  body_style TEXT,                      -- e.g., Sedan, Touring, Coupe
  market TEXT,                          -- e.g., EU, US, Global
  start_year INT CHECK (start_year >= 1950 AND start_year <= EXTRACT(YEAR FROM NOW()) + 1),
  end_year INT CHECK (end_year IS NULL OR (end_year >= start_year AND end_year <= EXTRACT(YEAR FROM NOW()) + 10)),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_car_models_model_code UNIQUE (model_code)
);

CREATE INDEX IF NOT EXISTS idx_car_models_series_name ON car_models(series_name);
CREATE INDEX IF NOT EXISTS idx_car_models_body_style ON car_models(body_style);

DROP TRIGGER IF EXISTS trg_car_models_set_updated_at ON car_models;
CREATE TRIGGER trg_car_models_set_updated_at
BEFORE UPDATE ON car_models
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE car_models IS 'BMW model platforms/generations (e.g., F30 3 Series).';
COMMENT ON COLUMN car_models.model_code IS 'BMW internal chassis code (E/F/G-series). Unique.';

-- car_trims: specific trims/engines within a model (e.g., 320i, 330i, M3)
CREATE TABLE IF NOT EXISTS car_trims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_model_id UUID NOT NULL,
  trim_name TEXT NOT NULL,               -- e.g., 330i, 320d, M3
  engine_code TEXT,                      -- e.g., N52B30, B58B30, S55B30
  fuel_type fuel_type_enum,              -- petrol/diesel/hybrid/electric
  transmission transmission_enum,        -- manual/automatic/dual_clutch
  drive_type drive_type_enum,            -- rwd/awd/fwd
  displacement_cc INT CHECK (displacement_cc IS NULL OR displacement_cc > 0),
  horsepower_ps INT CHECK (horsepower_ps IS NULL OR horsepower_ps > 0),
  torque_nm INT CHECK (torque_nm IS NULL OR torque_nm > 0),
  start_year INT CHECK (start_year IS NULL OR (start_year >= 1950 AND start_year <= EXTRACT(YEAR FROM NOW()) + 1)),
  end_year INT CHECK (end_year IS NULL OR (end_year >= start_year AND end_year <= EXTRACT(YEAR FROM NOW()) + 10)),
  market TEXT,                           -- e.g., EU, US, Global
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_car_trims_model
    FOREIGN KEY (car_model_id)
    REFERENCES car_models(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT uq_car_trims_model_trim_engine_start UNIQUE (car_model_id, trim_name, engine_code, start_year)
);

CREATE INDEX IF NOT EXISTS idx_car_trims_model ON car_trims(car_model_id);
CREATE INDEX IF NOT EXISTS idx_car_trims_trim_name ON car_trims(trim_name);

DROP TRIGGER IF EXISTS trg_car_trims_set_updated_at ON car_trims;
CREATE TRIGGER trg_car_trims_set_updated_at
BEFORE UPDATE ON car_trims
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE car_trims IS 'Specific trims within a model, including engine/transmission details.';
COMMENT ON COLUMN car_trims.trim_name IS 'Marketing trim (e.g., 330i, 320d, M3).';

-- parts: inventory items and OEM references
CREATE TABLE IF NOT EXISTS parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES part_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
  sku TEXT NOT NULL,                      -- internal SKU
  bmw_oem_number TEXT,                    -- BMW part number (11-xx-xxx-xxx style or plain)
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,                             -- e.g., BMW, Bosch, Mahle
  supplier TEXT,
  price_cents INT CHECK (price_cents IS NULL OR price_cents >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  min_stock_level INT NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
  location TEXT,                          -- bin/shelf
  weight_kg NUMERIC(8,3) CHECK (weight_kg IS NULL OR weight_kg >= 0),
  dimensions_mm JSONB,                    -- { length: mm, width: mm, height: mm }
  metadata JSONB,                         -- free-form extra data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_parts_sku UNIQUE (sku),
  CONSTRAINT uq_parts_oem UNIQUE (bmw_oem_number)
);

CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category_id);
CREATE INDEX IF NOT EXISTS idx_parts_oem ON parts(bmw_oem_number);
CREATE INDEX IF NOT EXISTS idx_parts_name ON parts(name);

DROP TRIGGER IF EXISTS trg_parts_set_updated_at ON parts;
CREATE TRIGGER trg_parts_set_updated_at
BEFORE UPDATE ON parts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE parts IS 'Inventory items including BMW OEM numbers and stock/pricing.';
COMMENT ON COLUMN parts.bmw_oem_number IS 'BMW OEM part number; unique if provided.';

-- Helpful views or future relations (not created now):
-- Consider a join table parts_car_trims(parts_id UUID, car_trim_id UUID) for fitment mapping.
-- Consider purchase_orders, suppliers, stock_movements for full inventory operations.


