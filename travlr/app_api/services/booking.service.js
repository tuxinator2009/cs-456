const crypto = require('crypto');

const bookingRepository =
require('../repositories/booking.repository');

const tripRepository =
require('../repositories/trip.repository');

const ApplicationError =
require('../errors/application-error');

const {
    parsePrice
} = require('../algorithms/trip-search');

const MIN_TRAVELERS = 1;
const MAX_TRAVELERS = 10;

/**
 * Creates a short, non-sequential public booking identifier.
 */
const generateBookingCode = () => {
    const randomPart = crypto
    .randomBytes(4)
    .toString('hex')
    .toUpperCase();

    return `TRV-${randomPart}`;
};

/**
 * Calculates and rounds a booking total to two decimal places.
 */
const calculateBookingTotal = (
    pricePerPerson,
    numberOfTravelers
) => {
    return Math.round(
        pricePerPerson *
        numberOfTravelers *
        100
    ) / 100;
};

const parseTravelerCount = (value) => {
    const count = Number(value);

    if (
        !Number.isInteger(count) ||
        count < MIN_TRAVELERS ||
        count > MAX_TRAVELERS
    ) {
        throw new ApplicationError(
            400,
            `numberOfTravelers must be an integer between ${MIN_TRAVELERS} and ${MAX_TRAVELERS}.`,
            'INVALID_TRAVELER_COUNT'
        );
    }

    return count;
};

const requireAuthenticatedUser = (auth) => {
    if (!auth?._id) {
        throw new ApplicationError(
            401,
            'Authentication is required.',
            'AUTHENTICATION_REQUIRED'
        );
    }
};

const isAdministrator = (auth) => {
    return auth?.role === 'admin';
};

/**
 * Tests whether the authenticated user owns a booking or is an administrator.
 */
const canAccessBooking = (
    auth,
    booking
) => {
    if (!auth || !booking) {
        return false;
    }

    if (isAdministrator(auth)) {
        return true;
    }

    return String(booking.userId) === String(auth._id);
};

const createBooking = async (
    auth,
    requestBody = {}
) => {
    requireAuthenticatedUser(auth);

    const tripCode =
    typeof requestBody.tripCode === 'string'
    ? requestBody.tripCode.trim().toUpperCase()
    : '';

    if (!tripCode) {
        throw new ApplicationError(
            400,
            'A trip code is required.',
            'TRIP_CODE_REQUIRED'
        );
    }

    const numberOfTravelers =
    parseTravelerCount(
        requestBody.numberOfTravelers
    );

    const trip =
    await tripRepository.findOneByCode(
        tripCode
    );

    if (!trip) {
        throw new ApplicationError(
            404,
            `No trip was found with code ${tripCode}.`,
            'TRIP_NOT_FOUND'
        );
    }

    const pricePerPerson =
    parsePrice(trip.perPerson);

    if (pricePerPerson === null) {
        throw new ApplicationError(
            422,
            'The selected trip does not contain a usable numeric price.',
            'INVALID_TRIP_PRICE'
        );
    }

    const bookingData = {
        bookingCode: generateBookingCode(),
        userId: auth._id,
        tripId: trip._id,
        tripCode: trip.code,
        tripName: trip.name,
        numberOfTravelers,
        travelStartDate: trip.start,
        status: 'confirmed',
        pricePerPerson,
        totalPrice:
        calculateBookingTotal(
            pricePerPerson,
            numberOfTravelers
        )
    };

    return bookingRepository.create(
        bookingData
    );
};

const listOwnBookings = async (auth) => {
    requireAuthenticatedUser(auth);

    return bookingRepository.findByUserId(
        auth._id
    );
};

const findBookingByCode = async (
    auth,
    bookingCode
) => {
    requireAuthenticatedUser(auth);

    const normalizedCode =
    typeof bookingCode === 'string'
    ? bookingCode.trim().toUpperCase()
    : '';

    if (!normalizedCode) {
        throw new ApplicationError(
            400,
            'A booking code is required.',
            'BOOKING_CODE_REQUIRED'
        );
    }

    const booking =
    await bookingRepository.findByCode(
        normalizedCode
    );

    if (!booking) {
        throw new ApplicationError(
            404,
            'The requested booking was not found.',
            'BOOKING_NOT_FOUND'
        );
    }

    if (!canAccessBooking(auth, booking)) {
        throw new ApplicationError(
            403,
            'You do not have permission to access this booking.',
            'BOOKING_ACCESS_DENIED'
        );
    }

    return booking;
};

const getBookingSummary = async (auth) => {
    requireAuthenticatedUser(auth);

    if (!isAdministrator(auth)) {
        throw new ApplicationError(
            403,
            'Administrator access is required.',
            'ADMIN_ACCESS_REQUIRED'
        );
    }

    return bookingRepository.getTripSummary();
};

module.exports = {
    generateBookingCode,
    calculateBookingTotal,
    canAccessBooking,
    createBooking,
    listOwnBookings,
    findBookingByCode,
    getBookingSummary
};
