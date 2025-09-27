import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
// User authentication
import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import { pool } from "./config/pool.js";
import { isAuth, isAdmin } from "./middleware/auth.js";

import userRouter from "./routes/userRouter.js";
import partCategoryRouter from "./routes/partCategoryRouter.js";
import partRouter from "./routes/partRouter.js";
import carModelRouter from "./routes/carModelRouter.js";
import carTrimRouter from "./routes/carTrimRouter.js";
import setCommonLocals from "./middleware/locals.js";

/**
 * -------------- GENERAL SETUP ----------------
 */

const PgSessionStore = connectPgSimple(expressSession);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

app.use(
    expressSession({
        store: new PgSessionStore({
            pool: pool, // Connection pool
            createTableIfMissing: true, //if set to true then creates the table in the case where the table does not already exist. Defaults to false.
            tableName: "sessionStore", // Use another table-name than the default "session" one
            // Insert connect-pg-simple options here
        }),
        secret: process.env.EXPRESS_SESSION_COOKIE_SECRET, // Improve in .env if possible
        resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
        // Insert express-session options here
    })
);
/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Configure passport strategies and serialization
configurePassport();

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log("🚀 ~ req.session:", req.session);
    console.log("🚀 ~ req.user:", req.user);
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Middleware to make current path available to all view templates
app.use(setCommonLocals);

app.use("/users", userRouter);
app.use("/parts", isAuth, partRouter);
app.use("/part-categories", isAuth, partCategoryRouter);
app.use("/car-models", isAuth, carModelRouter);
app.use("/car-trims", isAuth, carTrimRouter);

app.get("/", (req, res) => {
    res.render("index");
});
/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
// app.get("/protected-route", isAuth, (req, res, next) => {
//     res.send("You made it to the route.");
// });

// app.get("/admin-route", isAdmin, (req, res, next) => {
//     res.send("You made it to the admin route.");
// });

// // Visiting this route logs the user out
// app.get("/logout", (req, res, next) => {
//     req.logout();
//     res.redirect("/protected-route");
// });

// app.get("/login-success", (req, res, next) => {
//     res.send(
//         '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
//     );
// });

// app.get("/login-failure", (req, res, next) => {
//     res.send("You entered the wrong password.");
// });

/**
 * -------------- ERROR HANDLING ----------------
 */

/**
 * -------------- SERVER ----------------
 */

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    console.log(`Inventory app - listening on port ${PORT}!`);
});
