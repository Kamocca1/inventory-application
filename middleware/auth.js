// Authentication middleware functions

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // res.status(401).json({
        //     msg: "You are not authorized to view this resource",
        // });
        res.status(401).redirect("/users/login");
    }
}

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).json({
            msg: "You are not authorized to view this resource because you are not an admin.",
        });
    }
}

// Middleware to control admin privilege assignment
export function canManageAdminPrivileges(req, res, next) {
    // Only authenticated admins can grant/revoke admin privileges
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            msg: "You must be logged in to manage user privileges.",
        });
    }

    if (!req.user.admin) {
        return res.status(403).json({
            msg: "Only administrators can grant or revoke admin privileges.",
        });
    }

    // Check if trying to modify admin field
    if (req.body.admin !== undefined) {
        // Allow admin modification only if current user is admin
        next();
    } else {
        // If not modifying admin field, continue normally
        next();
    }
}

// Middleware to prevent non-admins from setting admin field
export function restrictAdminField(req, res, next) {
    // If user is not authenticated or not admin, remove admin field from request
    if (!req.isAuthenticated() || !req.user.admin) {
        if (req.body.admin !== undefined) {
            delete req.body.admin;
        }
    }
    next();
}
