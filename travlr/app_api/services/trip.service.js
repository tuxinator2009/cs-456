const tripRepository = require('../repositories/trip.repository');
const ApplicationError = require('../errors/application-error');

const REQUIRED_TRIP_FIELDS = [
    'code',
    'name',
    'length',
    'start',
    'resort',
    'perPerson',
    'image',
    'description'
];

/**
 * Produces a plain trip object containing only accepted fields.
 */
const normalizeTripData = (source = {}) => {
    return {
        code:
        typeof source.code === 'string'
        ? source.code.trim()
        : source.code,
        name:
        typeof source.name === 'string'
        ? source.name.trim()
        : source.name,
        length:
        typeof source.length === 'string'
        ? source.length.trim()
        : source.length,
        start: source.start,
        resort:
        typeof source.resort === 'string'
        ? source.resort.trim()
        : source.resort,
        perPerson:
        typeof source.perPerson === 'string'
        ? source.perPerson.trim()
        : source.perPerson,
        image:
        typeof source.image === 'string'
        ? source.image.trim()
        : source.image,
        description:
        typeof source.description === 'string'
        ? source.description.trim()
        : source.description
    };
};

/**
 * Verifies that all fields required by the current trip model are present.
 */
const validateTripData = (tripData) => {
    const missingFields = REQUIRED_TRIP_FIELDS.filter((field) => {
        const value = tripData[field];

        return (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        );
    });

    if (missingFields.length > 0) {
        throw new ApplicationError(
            400,
            `Missing required trip fields: ${missingFields.join(', ')}.`,
                                   'TRIP_VALIDATION_ERROR'
        );
    }
};

const listTrips = async () => {
    const trips = await tripRepository.findAll();

    // An empty trip list is valid and should return [] with HTTP 200.
    return trips || [];
};

const findTripByCode = async (tripCode) => {
    const normalizedCode =
    typeof tripCode === 'string' ? tripCode.trim() : '';

    if (!normalizedCode) {
        throw new ApplicationError(
            400,
            'A trip code is required.',
            'TRIP_CODE_REQUIRED'
        );
    }

    const trips = await tripRepository.findByCode(normalizedCode);

    if (!trips || trips.length === 0) {
        throw new ApplicationError(
            404,
            `No trip was found with code ${normalizedCode}.`,
            'TRIP_NOT_FOUND'
        );
    }

    return trips;
};

const createTrip = async (requestBody) => {
    const tripData = normalizeTripData(requestBody);

    validateTripData(tripData);

    return tripRepository.create(tripData);
};

const updateTrip = async (tripCode, requestBody) => {
    const normalizedCode =
    typeof tripCode === 'string' ? tripCode.trim() : '';

    if (!normalizedCode) {
        throw new ApplicationError(
            400,
            'A trip code is required.',
            'TRIP_CODE_REQUIRED'
        );
    }

    const tripData = normalizeTripData(requestBody);

    validateTripData(tripData);

    const updatedTrip = await tripRepository.updateByCode(
        normalizedCode,
        tripData
    );

    if (!updatedTrip) {
        throw new ApplicationError(
            404,
            `No trip was found with code ${normalizedCode}.`,
            'TRIP_NOT_FOUND'
        );
    }

    return updatedTrip;
};

module.exports = {
    listTrips,
    findTripByCode,
    createTrip,
    updateTrip
};
