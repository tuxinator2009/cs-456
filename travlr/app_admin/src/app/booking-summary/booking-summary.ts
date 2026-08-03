import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { BookingData } from '../services/booking-data';

import {
  BookingSummary as BookingSummaryRecord
} from '../models/booking-summary';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.css'
})
export class BookingSummary implements OnInit {
  public summary:
    BookingSummaryRecord[] = [];

    public isLoading = false;
    public errorMessage = '';

    constructor(
      private bookingData: BookingData
    ) {}

    public ngOnInit(): void {
      this.loadSummary();
    }

    public loadSummary(): void {
      this.isLoading = true;
      this.errorMessage = '';

      this.bookingData
      .getSummary()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (summary) => {
          this.summary = summary;
        },

        error: (error) => {
          console.error(error);

          this.summary = [];
          this.errorMessage =
          error?.error?.message ||
          'The booking summary could not be retrieved.';
        }
      });
    }
}
