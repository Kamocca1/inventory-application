import crypto from "crypto";

/**
 * Generates a random salt for password hashing
 * @returns {string} A random salt string
 */
export function genPasswordSaltAndHash(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const genHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {
        salt: salt,
        hash: genHash,
    };
}

/**
 * Validates a password against a stored hash and salt
 * @param {string} password - The plain text password to validate
 * @param {string} hash - The stored password hash
 * @param {string} salt - The stored salt
 * @returns {boolean} True if password is valid, false otherwise
 */
export function validPassword(password, hash, salt) {
    const hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return hash === hashVerify;
}
