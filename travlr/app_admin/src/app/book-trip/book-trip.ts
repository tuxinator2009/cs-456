import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { finalize } from 'rxjs';

import { BookingData } from '../services/booking-data';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';
import { Booking } from '../models/booking';

@Component({
  selector: 'app-book-trip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './book-trip.html',
  styleUrl: './book-trip.css'
})
export class BookTrip implements OnInit {
  public trip: Trip | null = null;
  public numberOfTravelers = 1;
  public isLoading = false;
  public errorMessage = '';
  public confirmation: Booking | null = null;

  constructor(
    private route: ActivatedRoute,
      private router: Router,
        private tripData: TripData,
          private bookingData: BookingData
  ) {}

  public ngOnInit(): void {
    const tripCode =
    this.route.snapshot.queryParamMap
    .get('tripCode');

    if (!tripCode) {
      this.errorMessage =
      'No trip was selected.';

    return;
    }

    this.isLoading = true;

    this.tripData
    .getTrip(tripCode)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (trips) => {
        this.trip = trips[0] ?? null;

        if (!this.trip) {
          this.errorMessage =
          'The selected trip could not be found.';
        }
      },

      error: (error) => {
        console.error(error);

        this.errorMessage =
        error?.error?.message ||
        'The selected trip could not be loaded.';
      }
    });
  }

  public submitBooking(): void {
    if (!this.trip) {
      return;
    }

    if (
      !Number.isInteger(
        this.numberOfTravelers
      ) ||
      this.numberOfTravelers < 1 ||
      this.numberOfTravelers > 10
    ) {
      this.errorMessage =
      'The traveler count must be between 1 and 10.';

        return;
    }

    this.errorMessage = '';
    this.confirmation = null;
    this.isLoading = true;

    this.bookingData
    .createBooking(
      this.trip.code,
      this.numberOfTravelers
    )
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (booking) => {
        this.confirmation = booking;
      },

      error: (error) => {
        console.error(error);

        this.errorMessage =
        error?.error?.message ||
        'The booking could not be completed.';
      }
    });
  }

  public viewBookings(): void {
    this.router.navigate([
      '/my-bookings'
    ]);
  }
}
