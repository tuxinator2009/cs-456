const tripService = require('../services/trip.service');
const ApplicationError = require('../errors/application-error');

/**
 * Converts known application failures and unexpected errors into
 * consistent JSON responses.
 */
const handleControllerError = (res, error) => {
    if (error instanceof ApplicationError) {
        return res.status(error.status).json({
            code: error.code,
            message: error.message
        });
    }

    // Mongoose validation errors should be reported as bad requests.
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            code: 'DATABASE_VALIDATION_ERROR',
            message: error.message
        });
    }

    // Duplicate index errors are raised by MongoDB with code 11000.
    if (error.code === 11000) {
        return res.status(409).json({
            code: 'DUPLICATE_TRIP',
            message: 'A trip with the supplied identifying value already exists.'
        });
    }

    console.error(error);

    return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected server error occurred.'
    });
};

// GET: /api/trips
const tripsList = async (req, res) => {
    try {
        const trips = await tripService.listTrips();

        return res.status(200).json(trips);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

// GET: /api/trips/:tripCode
const tripsFindByCode = async (req, res) => {
    try {
        const trips = await tripService.findTripByCode(
            req.params.tripCode
        );

        return res.status(200).json(trips);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

// POST: /api/trips
const tripsAddTrip = async (req, res) => {
    try {
        const trip = await tripService.createTrip(req.body);

        return res.status(201).json(trip);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

// PUT: /api/trips/:tripCode
const tripsUpdateTrip = async (req, res) => {
    try {
        const trip = await tripService.updateTrip(
            req.params.tripCode,
            req.body
        );

        return res.status(200).json(trip);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
