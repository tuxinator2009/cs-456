import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { Booking } from '../models/booking';

import {
  BookingSummary
} from '../models/booking-summary';

@Injectable({
  providedIn: 'root'
})
export class BookingData {
  private readonly bookingUrl =
  'http://localhost:3000/api/bookings';

  constructor(
    private http: HttpClient
  ) {}

  public createBooking(
    tripCode: string,
    numberOfTravelers: number
  ): Observable<Booking> {
    return this.http.post<Booking>(
      this.bookingUrl,
      {
        tripCode,
        numberOfTravelers
      }
    );
  }

  public getMyBookings():
    Observable<Booking[]> {
      return this.http.get<Booking[]>(
        this.bookingUrl
      );
    }

    public getBooking(
      bookingCode: string
    ): Observable<Booking> {
      return this.http.get<Booking>(
        `${this.bookingUrl}/${encodeURIComponent(bookingCode)}`
      );
    }

    public getSummary():
      Observable<BookingSummary[]> {
        return this.http.get<BookingSummary[]>(
          `${this.bookingUrl}/admin/summary`
        );
      }
}
