import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByUsername, findUserById } from "../models/User.js";
import { validPassword } from "../lib/passwordUtils.js";

// const customFields = {
//     usernameField: "uname",
//     passwordField: "pw",
// };

const verifyCallback = async (username, password, done) => {
    try {
        const user = await findUserByUsername(username);

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }

        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Incorrect password" });
        }
    } catch (err) {
        return done(err);
    }
};

/**
 * Configures passport authentication strategies and serialization
 * Call this function once during app initialization
 */
export function configurePassport() {
    const strategy = new LocalStrategy(/*customFields,*/ verifyCallback);

    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await findUserById(userId);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}
