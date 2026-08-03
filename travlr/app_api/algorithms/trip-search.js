/**
 * Converts a value to normalized lowercase text for comparison.
 */
const normalizeText = (value) => {
    return typeof value === 'string'
    ? value.trim().toLowerCase()
    : '';
};

/**
 * Parses the numeric price stored in the current string-based schema.
 */
const parsePrice = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.replace(/[$,\s]/g, '');
    const parsed = Number.parseFloat(normalized);

    return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Extracts the number of nights from values such as:
 * "4 nights / 5 days"
 */
const parseNights = (value) => {
    if (typeof value !== 'string') {
        return null;
    }

    const match = value.match(/(\d+)\s*nights?/i);

    if (!match) {
        return null;
    }

    const parsed = Number.parseInt(match[1], 10);

    return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Removes HTML tags before searching descriptive content.
 */
const stripHtml = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.replace(/<[^>]*>/g, ' ');
};

/**
 * Converts a keyword phrase into a Set of normalized tokens.
 *
 * A Set prevents duplicate words from increasing the score more than once.
 */
const tokenizeKeyword = (keyword) => {
    const normalized = normalizeText(keyword);

    if (!normalized) {
        return new Set();
    }

    return new Set(
        normalized
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean)
    );
};

/**
 * Calculates a weighted relevance score for one trip.
 */
const scoreTrip = (trip, keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) {
        return 0;
    }

    const code = normalizeText(trip.code);
    const name = normalizeText(trip.name);
    const resort = normalizeText(trip.resort);
    const description = normalizeText(stripHtml(trip.description));

    let score = 0;

    if (code === normalizedKeyword) {
        score += 100;
    } else if (code.includes(normalizedKeyword)) {
        score += 70;
    }

    if (name === normalizedKeyword) {
        score += 60;
    } else if (name.includes(normalizedKeyword)) {
        score += 40;
    }

    if (resort === normalizedKeyword) {
        score += 35;
    } else if (resort.includes(normalizedKeyword)) {
        score += 25;
    }

    if (description.includes(normalizedKeyword)) {
        score += 10;
    }

    const keywordTokens = tokenizeKeyword(normalizedKeyword);

    for (const token of keywordTokens) {
        if (name.includes(token)) {
            score += 8;
        }

        if (resort.includes(token)) {
            score += 5;
        }

        if (description.includes(token)) {
            score += 2;
        }
    }

    return score;
};

/**
 * Determines whether a trip satisfies numeric search criteria.
 */
const satisfiesNumericFilters = (trip, criteria) => {
    const price = parsePrice(trip.perPerson);
    const nights = parseNights(trip.length);

    if (
        criteria.minPrice !== null &&
        (price === null || price < criteria.minPrice)
    ) {
        return false;
    }

    if (
        criteria.maxPrice !== null &&
        (price === null || price > criteria.maxPrice)
    ) {
        return false;
    }

    if (
        criteria.nights !== null &&
        (nights === null || nights !== criteria.nights)
    ) {
        return false;
    }

    return true;
};

/**
 * Creates a deterministic comparator for the requested ordering.
 */
const createComparator = (sort, keyword) => {
    return (left, right) => {
        const leftPrice = parsePrice(left.trip.perPerson);
        const rightPrice = parsePrice(right.trip.perPerson);

        switch (sort) {
            case 'price-asc':
                return compareNullableNumbers(leftPrice, rightPrice) ||
                compareNames(left.trip, right.trip) ||
                left.index - right.index;

            case 'price-desc':
                return compareNullableNumbers(rightPrice, leftPrice) ||
                compareNames(left.trip, right.trip) ||
                left.index - right.index;

            case 'start-asc':
                return compareDates(left.trip.start, right.trip.start) ||
                compareNames(left.trip, right.trip) ||
                left.index - right.index;

            case 'name-asc':
                return compareNames(left.trip, right.trip) ||
                left.index - right.index;

            case 'relevance':
            default:
                return right.score - left.score ||
                compareDates(left.trip.start, right.trip.start) ||
                compareNames(left.trip, right.trip) ||
                left.index - right.index;
        }
    };
};

const compareNullableNumbers = (left, right) => {
    if (left === null && right === null) {
        return 0;
    }

    if (left === null) {
        return 1;
    }

    if (right === null) {
        return -1;
    }

    return left - right;
};

const compareDates = (left, right) => {
    const leftTime = new Date(left).getTime();
    const rightTime = new Date(right).getTime();

    const safeLeft = Number.isFinite(leftTime)
    ? leftTime
    : Number.POSITIVE_INFINITY;

    const safeRight = Number.isFinite(rightTime)
    ? rightTime
    : Number.POSITIVE_INFINITY;

    return safeLeft - safeRight;
};

const compareNames = (left, right) => {
    return normalizeText(left.name)
    .localeCompare(normalizeText(right.name));
};

/**
 * Filters, scores, and sorts trips.
 *
 * Decorating each trip with its original index guarantees deterministic
 * behavior when all other comparator values are equal.
 */
const rankTrips = (trips, criteria) => {
    return trips
    .filter((trip) => satisfiesNumericFilters(trip, criteria))
    .map((trip, index) => ({
        trip,
        index,
        score: scoreTrip(trip, criteria.keyword)
    }))
    .sort(createComparator(criteria.sort, criteria.keyword))
    .map((entry) => entry.trip);
};

module.exports = {
    normalizeText,
    parsePrice,
    parseNights,
    scoreTrip,
    rankTrips
};
