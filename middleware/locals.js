/**
 * Middleware to set up local variables available to all view templates in the views directory
 */

// Add other template locals here as the app grows
export default function setCommonLocals(req, res, next) {
    res.locals.currentPath = req.path;
    res.locals.user = req.user || null; // Make user available to all templates
    res.locals.errors = req.errors || null;
    res.locals.success = req.session?.success || null;

    // Clear success message after displaying it
    if (req.session?.success) {
        delete req.session.success;
    }

    next();
}
