const bookingService =
require('../services/booking.service');

const ApplicationError =
require('../errors/application-error');

const handleControllerError = (
    res,
    error
) => {
    if (error instanceof ApplicationError) {
        return res.status(error.status).json({
            code: error.code,
            message: error.message
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({
            code: 'DATABASE_VALIDATION_ERROR',
            message: error.message
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            code: 'DUPLICATE_BOOKING',
            message:
            'A booking identifier collision occurred. Please try again.'
        });
    }

    console.error(error);

    return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message:
        'An unexpected server error occurred.'
    });
};

// POST: /api/bookings
const bookingsCreate = async (
    req,
    res
) => {
    try {
        const booking =
        await bookingService.createBooking(
            req.auth,
            req.body
        );

        return res
        .status(201)
        .json(booking);
    } catch (error) {
        return handleControllerError(
            res,
            error
        );
    }
};

// GET: /api/bookings
const bookingsListOwn = async (
    req,
    res
) => {
    try {
        const bookings =
        await bookingService.listOwnBookings(
            req.auth
        );

        return res
        .status(200)
        .json(bookings);
    } catch (error) {
        return handleControllerError(
            res,
            error
        );
    }
};

// GET: /api/bookings/admin/summary
const bookingsSummary = async (
    req,
    res
) => {
    try {
        const summary =
        await bookingService.getBookingSummary(
            req.auth
        );

        return res
        .status(200)
        .json(summary);
    } catch (error) {
        return handleControllerError(
            res,
            error
        );
    }
};

// GET: /api/bookings/:bookingCode
const bookingsFindByCode = async (
    req,
    res
) => {
    try {
        const booking =
        await bookingService.findBookingByCode(
            req.auth,
            req.params.bookingCode
        );

        return res
        .status(200)
        .json(booking);
    } catch (error) {
        return handleControllerError(
            res,
            error
        );
    }
};

module.exports = {
    bookingsCreate,
    bookingsListOwn,
    bookingsSummary,
    bookingsFindByCode
};
