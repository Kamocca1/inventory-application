import passport from "passport";
import {
    findAllUsers,
    findUserById,
    findUserByUsername,
    createUser,
    updateUser,
    deleteUser,
} from "../models/User.js";

export function getLoginFormFormHandler(req, res) {
    res.render("users/login");
}

export function loginUserHandler(req, res, next) {
    passport.authenticate("local", {
        failureRedirect: "/users/login",
        successRedirect: "/",
    })(req, res, next);
}

export async function logoutUserHandler(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

export async function listUsersHandler(req, res) {
    try {
        const users = await findAllUsers();
        res.render("users/index", { users });
    } catch (err) {
        res.status(500).json({ error: "Failed to load users" });
    }
}

export async function getUserByIdHandler(req, res) {
    const { id } = req.params;
    try {
        const user = await findUserById(id);
        if (!user) return res.status(404).json({ error: "Not found" });
        res.render("users/detail", { user });
    } catch (err) {
        res.status(500).json({ error: "Failed to load user" });
    }
}

export async function getUserByUsernameHandler(req, res) {
    const { username } = req.params;
    try {
        const user = await findUserByUsername(username);
        if (!user) return res.status(404).json({ error: "Not found" });
        res.render("users/detail", { user });
    } catch (err) {
        res.status(500).json({ error: "Failed to load user" });
    }
}

export function getUserFormHandler(req, res) {
    res.render("users/create");
}

export async function getUserEditFormHandler(req, res) {
    const { id } = req.params;
    try {
        const user = await findUserById(id);
        if (!user) return res.status(404).json({ error: "Not found" });
        res.render("users/edit", { user });
    } catch (err) {
        res.status(500).json({ error: "Failed to load user" });
    }
}

export async function createUserHandler(req, res) {
    try {
        // sanitizedData is provided by the validateCreateUser middleware
        const user = await createUser(req.sanitizedData);
        res.redirect(`/users/${user.id}`);
    } catch (err) {
        console.error("Create user error:", err);
        res.status(500).json({
            error: `Failed to create user: ${err.message}`,
        });
    }
}

export async function updateUserHandler(req, res) {
    const { id } = req.params;
    try {
        // sanitizedData is provided by the validateUpdateUser middleware
        const user = await updateUser(id, req.sanitizedData);
        if (!user) return res.status(404).json({ error: "Not found" });
        res.redirect(`/users/${id}`);
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
}

export async function deleteUserHandler(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deleteUser(id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.redirect("/users");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}
