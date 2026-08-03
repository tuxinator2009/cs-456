const mongoose = require('mongoose');

// Ensure the model is registered with Mongoose.
require('../models/travlr');

const TripModel = mongoose.model('trips');

/**
 * Escapes special regular-expression characters from user input.
 */
const escapeRegularExpression = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Returns candidate trips using filters MongoDB can apply efficiently
 * with the current schema.
 */
const findCandidates = async ({
    keyword = '',
    resort = '',
    limit = 100
} = {}) => {
    const query = {};

    if (keyword) {
        const safeKeyword = escapeRegularExpression(keyword);
        const keywordExpression = new RegExp(safeKeyword, 'i');

        query.$or = [
            { code: keywordExpression },
            { name: keywordExpression },
            { resort: keywordExpression },
            { description: keywordExpression }
        ];
    }

    if (resort) {
        const safeResort = escapeRegularExpression(resort);
        query.resort = new RegExp(safeResort, 'i');
    }

    return TripModel
    .find(query)
    .limit(limit)
    .exec();
};

/**
 * Returns every trip in the collection.
 */
const findAll = async () => {
    return TripModel.find({}).exec();
};

/**
 * Returns trips matching a trip code.
 */
const findByCode = async (tripCode) => {
    return TripModel.find({ code: tripCode }).exec();
};

/**
 * Returns one trip identified by its trip code.
 *
 * This operation is used internally by the booking service while the
 * existing public endpoint continues returning an array for compatibility.
 */
const findOneByCode = async (tripCode) => {
    return TripModel
    .findOne({
        code: tripCode
    })
    .exec();
};

/**
 * Creates and saves a trip.
 */
const create = async (tripData) => {
    const trip = new TripModel(tripData);
    return trip.save();
};

/**
 * Updates a trip identified by its existing trip code.
 */
const updateByCode = async (tripCode, tripData) => {
    return TripModel.findOneAndUpdate(
        { code: tripCode },
        tripData,
        {
            new: true,
            runValidators: true
        }
    ).exec();
};

module.exports = {
    findCandidates,
    findAll,
    findByCode,
    findOneByCode,
    create,
    updateByCode
};
