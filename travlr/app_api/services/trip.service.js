const tripRepository = require('../repositories/trip.repository');
const ApplicationError = require('../errors/application-error');

const {
    rankTrips
} = require('../algorithms/trip-search');

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

const ALLOWED_SORTS = new Set([
    'relevance',
    'price-asc',
    'price-desc',
    'start-asc',
    'name-asc'
]);

const DEFAULT_RESULT_LIMIT = 100;
const MAX_RESULT_LIMIT = 250;

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
            (
                typeof value === 'string' &&
                value.trim() === ''
            )
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

const normalizeOptionalText = (value) => {
    return typeof value === 'string'
    ? value.trim()
    : '';
};

const parseOptionalNumber = (
    value,
    fieldName,
    {
        minimum = 0,
        integer = false
    } = {}
) => {
    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return null;
    }

    const parsed = integer
    ? Number.parseInt(value, 10)
    : Number.parseFloat(value);

    if (
        !Number.isFinite(parsed) ||
        parsed < minimum ||
        (integer && !Number.isInteger(parsed))
    ) {
        throw new ApplicationError(
            400,
            `${fieldName} must be a valid number greater than or equal to ${minimum}.`,
            'INVALID_SEARCH_CRITERIA'
        );
    }

    return parsed;
};

/**
 * Converts raw query-string input into a validated criteria object.
 */
const normalizeSearchCriteria = (source = {}) => {
    const keyword = normalizeOptionalText(source.keyword);
    const resort = normalizeOptionalText(source.resort);

    const minPrice = parseOptionalNumber(
        source.minPrice,
        'minPrice'
    );

    const maxPrice = parseOptionalNumber(
        source.maxPrice,
        'maxPrice'
    );

    const nights = parseOptionalNumber(
        source.nights,
        'nights',
        {
            minimum: 1,
            integer: true
        }
    );

    const requestedLimit = parseOptionalNumber(
        source.limit,
        'limit',
        {
            minimum: 1,
            integer: true
        }
    );

    const sort = normalizeOptionalText(source.sort) || 'relevance';

    if (!ALLOWED_SORTS.has(sort)) {
        throw new ApplicationError(
            400,
            `Unsupported sort option: ${sort}.`,
            'INVALID_SORT_OPTION'
        );
    }

    if (
        minPrice !== null &&
        maxPrice !== null &&
        minPrice > maxPrice
    ) {
        throw new ApplicationError(
            400,
            'minPrice cannot be greater than maxPrice.',
            'INVALID_PRICE_RANGE'
        );
    }

    return {
        keyword,
        resort,
        minPrice,
        maxPrice,
        nights,
        sort,
        limit: Math.min(
            requestedLimit || DEFAULT_RESULT_LIMIT,
            MAX_RESULT_LIMIT
        )
    };
};

/**
 * Retrieves candidate trips and applies application-level search logic.
 */
const listTrips = async (rawCriteria = {}) => {
    const criteria = normalizeSearchCriteria(rawCriteria);

    const candidates = await tripRepository.findCandidates({
        keyword: criteria.keyword,
        resort: criteria.resort,
        limit: criteria.limit
    });

    return rankTrips(candidates || [], criteria);
};

const findTripByCode = async (tripCode) => {
    const normalizedCode =
    typeof tripCode === 'string'
    ? tripCode.trim()
    : '';

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
    typeof tripCode === 'string'
    ? tripCode.trim()
    : '';

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
    normalizeSearchCriteria,
    listTrips,
    findTripByCode,
    createTrip,
    updateTrip
};
