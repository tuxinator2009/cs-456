const express = require('express');

const router = express.Router();

const tripsController =
require('../controllers/trips');

const authController =
require('../controllers/authentication');

const bookingsController =
require('../controllers/bookings');

const {
  authenticateJWT
} = require('../middleware/authentication');

const {
  requireRole
} = require('../middleware/authorization');

router
.route('/register')
.post(authController.register);

router
.route('/login')
.post(authController.login);

// Trip collection routes.
router
.route('/trips')
.get(tripsController.tripsList)
.post(
  authenticateJWT,
  requireRole('admin'),
      tripsController.tripsAddTrip
);

// Individual trip routes.
router
.route('/trips/:tripCode')
.get(tripsController.tripsFindByCode)
.put(
  authenticateJWT,
  requireRole('admin'),
     tripsController.tripsUpdateTrip
);

// Booking collection routes.
router
.route('/bookings')
.get(
  authenticateJWT,
  bookingsController.bookingsListOwn
)
.post(
  authenticateJWT,
  bookingsController.bookingsCreate
);

// Administrative booking aggregation.
router
.route('/bookings/admin/summary')
.get(
  authenticateJWT,
  requireRole('admin'),
     bookingsController.bookingsSummary
);

// Individual booking route.
router
.route('/bookings/:bookingCode')
.get(
  authenticateJWT,
  bookingsController.bookingsFindByCode
);

module.exports = router;
