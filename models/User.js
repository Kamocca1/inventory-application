import { pool } from "../config/pool.js";

/**
 * Retrieves all users from the database ordered by username in ascending order.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 * Each user object contains: id, username, first_name, last_name, email, admin, created_at, updated_at
 * Note: hash and salt are excluded for security reasons
 */
export async function findAllUsers() {
    const { rows } = await pool.query(
        `SELECT id, username, first_name, last_name, email, admin, created_at, updated_at
         FROM users ORDER BY username ASC`
    );
    return rows;
}

/**
 * Retrieves a single user from the database by its ID.
 *
 * @param {string} id - The unique identifier of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to a user object if found, or null if not found.
 * The user object contains: id, username, first_name, last_name, email, admin, created_at, updated_at
 * Note: hash and salt are excluded for security reasons
 */
export async function findUserById(id) {
    const { rows } = await pool.query(
        `SELECT id, username, first_name, last_name, email, admin, created_at, updated_at
         FROM users WHERE id = $1`,
        [id]
    );
    return rows[0] || null;
}

/**
 * Retrieves a single user from the database by username, including sensitive data.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to a user object if found, or null if not found.
 * The user object contains: id, username, first_name, last_name, email, hash, salt, admin, created_at, updated_at
 * Note: This function includes hash and salt for authentication purposes
 */
export async function findUserByUsername(username) {
    const { rows } = await pool.query(
        `SELECT id, username, first_name, last_name, email, hash, salt, admin, created_at, updated_at
         FROM users WHERE username = $1`,
        [username]
    );
    return rows[0] || null;
}

/**
 * Creates a new user in the database.
 *
 * @param {Object} userData - The user data object containing all user properties.
 * @param {string} userData.username - The username for the user.
 * @param {string} userData.firstName - The first name for the user.
 * @param {string} userData.lastName - The last name for the user.
 * @param {string} userData.email - The email for the user.
 * @param {string} userData.hash - The password hash for the user.
 * @param {string} userData.salt - The salt used for password hashing.
 * @param {boolean} userData.admin - Whether the user has admin privileges.
 * @returns {Promise<Object>} A promise that resolves to the created user object with all fields including id, created_at, and updated_at.
 * Note: hash and salt are excluded from the returned object for security reasons
 */
export async function createUser(userData) {
    const {
        username,
        firstName,
        lastName,
        email,
        hash,
        salt,
        admin = false,
    } = userData;

    const { rows } = await pool.query(
        `INSERT INTO users (username, first_name, last_name, email, hash, salt, admin)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, first_name, last_name, email, admin, created_at, updated_at`,
        [username, firstName, lastName, email, hash, salt, admin]
    );
    return rows[0];
}

/**
 * Updates an existing user in the database.
 *
 * @param {string} id - The unique identifier of the user to update.
 * @param {Object} userData - The user data object containing updated user properties.
 * @param {string} userData.username - The username for the user.
 * @param {string} userData.firstName - The first name for the user (optional).
 * @param {string} userData.lastName - The last name for the user (optional).
 * @param {string} userData.email - The email for the user (optional).
 * @param {string} userData.hash - The password hash for the user (optional).
 * @param {string} userData.salt - The salt used for password hashing (optional).
 * @param {boolean} userData.admin - Whether the user has admin privileges.
 * @returns {Promise<Object|null>} A promise that resolves to the updated user object if found and updated, or null if not found.
 * Note: hash and salt are excluded from the returned object for security reasons
 */
export async function updateUser(id, userData) {
    const { username, firstName, lastName, email, hash, salt, admin } =
        userData;

    // Build dynamic query based on provided fields
    const fields = [];
    const values = [id];
    let paramCount = 1;

    if (username !== undefined) {
        fields.push(`username=$${++paramCount}`);
        values.push(username);
    }
    if (firstName !== undefined) {
        fields.push(`first_name=$${++paramCount}`);
        values.push(firstName);
    }
    if (lastName !== undefined) {
        fields.push(`last_name=$${++paramCount}`);
        values.push(lastName);
    }
    if (email !== undefined) {
        fields.push(`email=$${++paramCount}`);
        values.push(email);
    }
    if (hash !== undefined && salt !== undefined) {
        fields.push(`hash=$${++paramCount}`, `salt=$${++paramCount}`);
        values.push(hash, salt);
    }
    if (admin !== undefined) {
        fields.push(`admin=$${++paramCount}`);
        values.push(admin);
    }

    if (fields.length === 0) {
        // No fields to update, return current user
        return await findUserById(id);
    }

    const { rows } = await pool.query(
        `UPDATE users SET ${fields.join(", ")}
         WHERE id=$1
         RETURNING id, username, first_name, last_name, email, admin, created_at, updated_at`,
        values
    );
    return rows[0] || null;
}

/**
 * Deletes a user from the database by its ID.
 *
 * @param {string} id - The unique identifier of the user to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully deleted, false if no user was found with the given ID.
 */
export async function deleteUser(id) {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id=$1", [
        id,
    ]);
    return rowCount > 0;
}
