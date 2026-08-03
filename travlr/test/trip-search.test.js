const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parsePrice,
    parseNights,
    scoreTrip,
    rankTrips
} = require('../app_api/algorithms/trip-search');

const trips = [
    {
        code: 'GALR210214',
        name: 'Gale Reef',
        length: '4 nights / 5 days',
        start: '2021-02-14T08:00:00Z',
        resort: 'Emerald Bay, 3 stars',
        perPerson: '799.00',
        description: '<p>Affordable reef adventure.</p>'
    },
    {
        code: 'DAWR210315',
        name: "Dawson's Reef",
        length: '4 nights / 5 days',
        start: '2021-03-15T08:00:00Z',
        resort: 'Blue Lagoon, 4 stars',
        perPerson: '1199.00',
        description: '<p>Premium lagoon experience.</p>'
    }
];

test('parsePrice converts string prices to numbers', () => {
    assert.equal(parsePrice('1,199.00'), 1199);
    assert.equal(parsePrice('$799.00'), 799);
});

test('parseNights extracts the number of nights', () => {
    assert.equal(
        parseNights('4 nights / 5 days'),
                 4
    );
});

test('exact trip-code matches receive the highest score', () => {
    const codeScore = scoreTrip(
        trips[0],
        'GALR210214'
    );

    const reefScore = scoreTrip(
        trips[0],
        'reef'
    );

    assert.ok(codeScore > reefScore);
});

test('rankTrips applies price filters', () => {
    const results = rankTrips(
        trips,
        {
            keyword: '',
            minPrice: 800,
            maxPrice: 1500,
            nights: null,
            sort: 'price-asc'
        }
    );

    assert.equal(results.length, 1);
    assert.equal(
        results[0].code,
        'DAWR210315'
    );
});

test('rankTrips sorts prices in ascending order', () => {
    const results = rankTrips(
        trips,
        {
            keyword: '',
            minPrice: null,
            maxPrice: null,
            nights: null,
            sort: 'price-asc'
        }
    );

    assert.deepEqual(
        results.map((trip) => trip.code),
                     [
                         'GALR210214',
                     'DAWR210315'
                     ]
    );
});
