const User = require('../models/user');
const passport = require('passport');

/**
 * Registers a customer account.
 *
 * Public registration never accepts a role from the request body.
 */
const register = async (req, res) => {
    try {
        if (
            !req.body.name ||
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        const user = new User({
            name: req.body.name.trim(),
                              email: req.body.email.trim().toLowerCase(),
                              role: 'customer'
        });

        user.setPassword(req.body.password);

        await user.save();

        const token = user.generateJWT();

        return res.status(201).json({
            token
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                'An account with that email address already exists.'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: 'The account could not be created.'
        });
    }
};

const login = (req, res) => {
    if (
        !req.body.email ||
        !req.body.password
    ) {
        return res.status(400).json({
            message:
            'Email and password are required.'
        });
    }

    passport.authenticate(
        'local',
        (error, user, info) => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    message:
                    'Authentication could not be completed.'
                });
            }

            if (!user) {
                return res.status(401).json(
                    info || {
                        message:
                        'Incorrect email or password.'
                    }
                );
            }

            return res.status(200).json({
                token: user.generateJWT()
            });
        }
    )(req, res);
};

module.exports = {
    register,
    login
};
