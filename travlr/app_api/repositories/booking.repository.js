const mongoose = require('mongoose');

require('../models/booking');

const BookingModel = mongoose.model('bookings');

/**
 * Creates a booking document.
 */
const create = async (bookingData) => {
    const booking = new BookingModel(bookingData);

    return booking.save();
};

/**
 * Returns all bookings belonging to one user.
 */
const findByUserId = async (userId) => {
    return BookingModel
    .find({
        userId
    })
    .sort({
        bookingDate: -1
    })
    .populate(
        'tripId',
        'code name resort image'
    )
    .lean()
    .exec();
};

/**
 * Returns one booking by its public booking code.
 */
const findByCode = async (bookingCode) => {
    return BookingModel
    .findOne({
        bookingCode
    })
    .populate(
        'tripId',
        'code name resort image'
    )
    .lean()
    .exec();
};

/**
 * Aggregates confirmed bookings into a trip-level administrative summary.
 */
const getTripSummary = async () => {
    return BookingModel.aggregate([
        {
            $match: {
                status: 'confirmed'
            }
        },
        {
            $group: {
                _id: '$tripId',
                bookingCount: {
                    $sum: 1
                },
                travelerCount: {
                    $sum: '$numberOfTravelers'
                },
                totalRevenue: {
                    $sum: '$totalPrice'
                },
                earliestBooking: {
                    $min: '$bookingDate'
                },
                latestBooking: {
                    $max: '$bookingDate'
                }
            }
        },
        {
            $lookup: {
                from: 'trips',
                localField: '_id',
                foreignField: '_id',
                    as: 'trip'
            }
        },
        {
            $unwind: {
                path: '$trip',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                tripId: '$_id',
                tripCode: {
                    $ifNull: [
                        '$trip.code',
                        'UNKNOWN'
                    ]
                },
                tripName: {
                    $ifNull: [
                        '$trip.name',
                        'Deleted Trip'
                    ]
                },
                bookingCount: 1,
                travelerCount: 1,
                totalRevenue: 1,
                earliestBooking: 1,
                latestBooking: 1
            }
        },
        {
            $sort: {
                totalRevenue: -1,
                tripName: 1
            }
        }
    ]).exec();
};

module.exports = {
    create,
    findByUserId,
    findByCode,
    getTripSummary
};
