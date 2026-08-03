const test = require('node:test');
const assert = require('node:assert/strict');

const {
    calculateBookingTotal,
    canAccessBooking,
    generateBookingCode
} = require('../app_api/services/booking.service');

test(
    'calculateBookingTotal returns a two-decimal booking total',
     () => {
         assert.equal(
             calculateBookingTotal(
                 1199,
                 3
             ),
             3597
         );

         assert.equal(
             calculateBookingTotal(
                 799.99,
                 2
             ),
             1599.98
         );
     }
);

test(
    'booking codes use the expected public format',
     () => {
         const code =
         generateBookingCode();

         assert.match(
             code,
             /^TRV-[A-F0-9]{8}$/
         );
     }
);

test(
    'a customer can access their own booking',
     () => {
         assert.equal(
             canAccessBooking(
                 {
                     _id: 'user-one',
                     role: 'customer'
                 },
                 {
                     userId: 'user-one'
                 }
             ),
             true
         );
     }
);

test(
    'a customer cannot access another user booking',
     () => {
         assert.equal(
             canAccessBooking(
                 {
                     _id: 'user-one',
                     role: 'customer'
                 },
                 {
                     userId: 'user-two'
                 }
             ),
             false
         );
     }
);

test(
    'an administrator can access another user booking',
     () => {
         assert.equal(
             canAccessBooking(
                 {
                     _id: 'admin-one',
                     role: 'admin'
                 },
                 {
                     userId: 'user-two'
                 }
             ),
             true
         );
     }
);
