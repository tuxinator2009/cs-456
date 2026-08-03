const mongoose = require('mongoose');

const BOOKING_STATUSES = [
    'confirmed',
    'cancelled'
];

const bookingSchema = new mongoose.Schema(
    {
        bookingCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true
        },

        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trips',
            required: true,
            index: true
        },

        tripCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        tripName: {
            type: String,
            required: true,
            trim: true
        },

        numberOfTravelers: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },

        bookingDate: {
            type: Date,
            required: true,
            default: Date.now
        },

        travelStartDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: BOOKING_STATUSES,
            default: 'confirmed'
        },

        pricePerPerson: {
            type: Number,
            required: true,
            min: 0
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// Supports efficient retrieval of a customer's most recent bookings.
bookingSchema.index({
    userId: 1,
    bookingDate: -1
});

// Supports trip-level reporting and status filtering.
bookingSchema.index({
    tripId: 1,
    status: 1
});

// Supports chronological administrative reporting.
bookingSchema.index({
    status: 1,
    bookingDate: -1
});

const Booking = mongoose.model(
    'bookings',
    bookingSchema
);

module.exports = Booking;
