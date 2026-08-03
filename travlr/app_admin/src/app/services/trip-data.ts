import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { Trip } from '../models/trip';
import {
  TripSearchCriteria
} from '../models/trip-search-criteria';

@Injectable({
  providedIn: 'root',
})
export class TripData {
  private readonly baseUrl = 'http://localhost:3000/api';
    private readonly tripUrl = `${this.baseUrl}/trips`;

    constructor(private http: HttpClient) {}

    public getTrips(
      criteria?: Partial<TripSearchCriteria>
    ): Observable<Trip[]> {
      let params = new HttpParams();

      if (criteria?.keyword?.trim()) {
        params = params.set(
          'keyword',
          criteria.keyword.trim()
        );
      }

      if (criteria?.resort?.trim()) {
        params = params.set(
          'resort',
          criteria.resort.trim()
        );
      }

      if (
        criteria?.minPrice !== null &&
        criteria?.minPrice !== undefined
      ) {
        params = params.set(
          'minPrice',
          criteria.minPrice.toString()
        );
      }

      if (
        criteria?.maxPrice !== null &&
        criteria?.maxPrice !== undefined
      ) {
        params = params.set(
          'maxPrice',
          criteria.maxPrice.toString()
        );
      }

      if (
        criteria?.nights !== null &&
        criteria?.nights !== undefined
      ) {
        params = params.set(
          'nights',
          criteria.nights.toString()
        );
      }

      if (criteria?.sort) {
        params = params.set(
          'sort',
          criteria.sort
        );
      }

      return this.http.get<Trip[]>(
        this.tripUrl,
        { params }
      );
    }

    public addTrip(
      formData: Trip
    ): Observable<Trip> {
      return this.http.post<Trip>(
        this.tripUrl,
        formData
      );
    }

    public getTrip(
      tripCode: string
    ): Observable<Trip[]> {
      return this.http.get<Trip[]>(
        `${this.tripUrl}/${encodeURIComponent(tripCode)}`
      );
    }

    public updateTrip(
      formData: Trip
    ): Observable<Trip> {
      return this.http.put<Trip>(
        `${this.tripUrl}/${encodeURIComponent(formData.code)}`,
                                 formData
      );
    }

    public login(
      user: User,
      password: string
    ): Observable<AuthResponse> {
      return this.handleAuthAPICall(
        'login',
        user,
        password
      );
    }

    public register(
      user: User,
      password: string
    ): Observable<AuthResponse> {
      return this.handleAuthAPICall(
        'register',
        user,
        password
      );
    }

    private handleAuthAPICall(
      endpoint: string,
      user: User,
      password: string
    ): Observable<AuthResponse> {
      const formData = {
        name: user.name,
        email: user.email,
        password
      };

      return this.http.post<AuthResponse>(
        `${this.baseUrl}/${endpoint}`,
        formData
      );
    }
}
