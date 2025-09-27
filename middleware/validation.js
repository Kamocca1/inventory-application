// Data validation and sanitization middleware
import { query, body, validationResult } from "express-validator";
import { genPasswordSaltAndHash } from "../lib/passwordUtils.js";
import { findUserByUsername } from "../models/User.js";

const alphaErr = "must only contain letters.";
const nameLengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be formatted properly";
const userNameErr =
    "must only contain letters, numbers, underscores, and hyphens";
const passwordLengthErr = "must be at least 8 characters long";
const adminBoolErr = "must be a boolean value";

// // Search validation
// export const validateSearch = [
//     query("name")
//         .trim()
//         .notEmpty()
//         .withMessage(`Cannot be empty`)
//         .isAlpha()
//         .withMessage(`Name ${alphaErr}`),
// ];

// User creation validation - all fields required
export const validateCreateUser = [
    // Sanitization
    body("firstName").trim(),
    body("lastName").trim(),
    body("email").trim().normalizeEmail(),
    body("username").trim(),
    body("password").trim(),
    body("admin").customSanitizer((value) => {
        return value === true || value === "true" || value === "on"
            ? true
            : false;
    }),

    // Validation - all fields required for creation
    body("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`First name ${nameLengthErr}`),
    body("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`Last name ${nameLengthErr}`),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage(`Email ${emailErr}`),
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(`Username ${userNameErr}`)
        .custom(async (value) => {
            const existingUser = await findUserByUsername(value);
            if (existingUser) {
                throw new Error("Username already exists");
            }
            return true;
        }),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage(`Password ${passwordLengthErr}`),
    body("admin").isBoolean().withMessage(`Admin ${adminBoolErr}`),

    // Error handling and data processing
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("users/create", {
                errors: errors.array(),
            });
        }

        // Create sanitizedData object with processed fields
        const { username, password, admin, firstName, lastName, email } =
            req.body;
        req.sanitizedData = {
            username,
            admin,
            firstName,
            lastName,
            email,
        };

        // Hash password (required for creation)
        const { salt, hash } = genPasswordSaltAndHash(password);
        req.sanitizedData.salt = salt;
        req.sanitizedData.hash = hash;

        next();
    },
];

// User update validation - password optional, admin field restricted
export const validateUpdateUser = [
    // Sanitization
    body("firstName").trim(),
    body("lastName").trim(),
    body("email").trim().normalizeEmail(),
    body("username").trim(),
    body("password").trim(),
    body("admin").customSanitizer((value) => {
        return value === true || value === "true" || value === "on"
            ? true
            : false;
    }),

    // Validation - fields optional for updates except username
    body("firstName")
        .optional({ checkFalsy: false })
        .isAlpha()
        .withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`First name ${nameLengthErr}`),
    body("lastName")
        .optional({ checkFalsy: false })
        .isAlpha()
        .withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 })
        .withMessage(`Last name ${nameLengthErr}`),
    body("email")
        .optional({ checkFalsy: false })
        .isEmail()
        .withMessage(`Email ${emailErr}`),
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(`Username ${userNameErr}`),
    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 8 })
        .withMessage(`Password ${passwordLengthErr}`),
    body("admin").isBoolean().withMessage(`Admin ${adminBoolErr}`),

    // Error handling and data processing
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("users/edit", {
                errors: errors.array(),
                user: req.body, // Pass back form data
            });
        }

        // Create sanitizedData object with processed fields
        const { username, password, admin, firstName, lastName, email } =
            req.body;
        req.sanitizedData = {
            username,
            admin,
            firstName,
            lastName,
            email,
        };

        // Handle password hashing if provided
        if (password && password.trim() !== "") {
            const { salt, hash } = genPasswordSaltAndHash(password);
            req.sanitizedData.salt = salt;
            req.sanitizedData.hash = hash;
        }

        next();
    },
];

export function sanitizePartData(req, res, next) {
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

    // Sanitize and convert data
    req.sanitizedData = {
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
        supplier: supplier && supplier.trim() !== "" ? supplier.trim() : null,
        price_cents:
            price_cents && price_cents !== "" ? parseInt(price_cents) : null,
        currency: currency || "USD",
        stock_quantity:
            stock_quantity && stock_quantity !== ""
                ? parseInt(stock_quantity)
                : 0,
        min_stock_level:
            min_stock_level && min_stock_level !== ""
                ? parseInt(min_stock_level)
                : 0,
        location: location && location.trim() !== "" ? location.trim() : null,
        weight_kg: weight_kg && weight_kg !== "" ? parseFloat(weight_kg) : null,
        dimensions_mm: null,
        metadata: null,
    };

    // Parse JSON fields safely
    if (dimensions_mm && dimensions_mm.trim() !== "") {
        try {
            req.sanitizedData.dimensions_mm = JSON.parse(dimensions_mm);
        } catch (e) {
            return res
                .status(400)
                .json({ error: "Invalid JSON format in dimensions" });
        }
    }

    if (metadata && metadata.trim() !== "") {
        try {
            req.sanitizedData.metadata = JSON.parse(metadata);
        } catch (e) {
            return res
                .status(400)
                .json({ error: "Invalid JSON format in metadata" });
        }
    }

    // Validate required fields
    if (!req.sanitizedData.sku || !req.sanitizedData.name) {
        return res.status(400).json({ error: "SKU and Name are required" });
    }

    next();
}
