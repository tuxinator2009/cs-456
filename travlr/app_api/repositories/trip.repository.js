const mongoose = require('mongoose');

// Ensure the model is registered with Mongoose.
require('../models/travlr');

const TripModel = mongoose.model('trips');

/**
 * Returns every trip in the collection.
 */
const findAll = async () => {
    return TripModel.find({}).exec();
};

/**
 * Returns trips matching a trip code.
 *
 * This currently preserves the original array response expected by the
 * Angular edit component. A later database enhancement can enforce code
 * uniqueness and replace this operation with findOne().
 */
const findByCode = async (tripCode) => {
    return TripModel.find({ code: tripCode }).exec();
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
 *
 * The new:true option returns the updated record rather than the previous
 * version.
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
    findAll,
    findByCode,
    create,
    updateByCode
};
