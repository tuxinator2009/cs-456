import { Routes } from '@angular/router';

import { AddTrip } from './add-trip/add-trip';
import { EditTrip } from './edit-trip/edit-trip';
import { TripListing } from './trip-listing/trip-listing';
import { Login } from './login/login';

import { BookTrip } from './book-trip/book-trip';
import { MyBookings } from './my-bookings/my-bookings';
import {
  BookingSummary
} from './booking-summary/booking-summary';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'add-trip',
    component: AddTrip,
    canActivate: [
      adminGuard
    ]
  },

  {
    path: 'edit-trip',
    component: EditTrip,
    canActivate: [
      adminGuard
    ]
  },

  {
    path: 'book-trip',
    component: BookTrip,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'my-bookings',
    component: MyBookings,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'booking-summary',
    component: BookingSummary,
    canActivate: [
      adminGuard
    ]
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: TripListing,
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: ''
  }
];
