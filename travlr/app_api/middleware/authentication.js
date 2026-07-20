const jwt = require('jsonwebtoken');

/**
 * Verifies the bearer token supplied in the Authorization header.
 *
 * A successful verification stores the decoded JWT payload on req.auth.
 * The request continues only after jwt.verify confirms that the token is
 * valid.
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization header is required.'
        });
    }

    const headerParts = authHeader.trim().split(/\s+/);

    if (
        headerParts.length !== 2 ||
        headerParts[0].toLowerCase() !== 'bearer'
    ) {
        return res.status(401).json({
            message:
            'Authorization header must use the format: Bearer <token>.'
        });
    }

    const token = headerParts[1];

    if (!token) {
        return res.status(401).json({
            message: 'Bearer token is required.'
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined.');

        return res.status(500).json({
            message: 'Authentication service is not configured.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            return res.status(401).json({
                message: 'Token validation failed.'
            });
        }

        req.auth = decodedToken;
        return next();
    });
};

module.exports = {
    authenticateJWT
};
