import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { BookingData } from '../services/booking-data';
import { Booking } from '../models/booking';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {
  public bookings: Booking[] = [];
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private bookingData: BookingData
  ) {}

  public ngOnInit(): void {
    this.loadBookings();
  }

  public loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingData
    .getMyBookings()
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },

      error: (error) => {
        console.error(error);

        this.bookings = [];
        this.errorMessage =
        error?.error?.message ||
        'Bookings could not be retrieved.';
      }
    });
  }
}
