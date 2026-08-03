/**
 * Requires the authenticated user to possess one of the supplied roles.
 *
 * This middleware must run after authenticateJWT.
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.auth?.role;

        if (!role) {
            return res.status(403).json({
                message:
                'The authenticated account does not have an assigned role.'
            });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                message:
                'You do not have permission to access this resource.'
            });
        }

        return next();
    };
};

module.exports = {
    requireRole
};
