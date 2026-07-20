const express = require('express');

const router = express.Router();

// Import controllers routed by this module.
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Import reusable authentication middleware.
const {
  authenticateJWT
} = require('../middleware/authentication');

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// Collection routes.
router
.route('/trips')
.get(tripsController.tripsList)
.post(authenticateJWT, tripsController.tripsAddTrip);

// Individual trip routes.
router
.route('/trips/:tripCode')
.get(tripsController.tripsFindByCode)
.put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
