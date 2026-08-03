import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';
import {
  TripSearchCriteria,
  TripSortOption
} from '../models/trip-search-criteria';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TripCard
  ],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  public trips: Trip[] = [];
  public message = '';
  public isLoading = false;
  public errorMessage = '';

  public criteria: TripSearchCriteria =
    this.createDefaultCriteria();

    public readonly sortOptions: Array<{
      value: TripSortOption;
      label: string;
    }> = [
      {
        value: 'relevance',
        label: 'Relevance'
      },
      {
        value: 'price-asc',
        label: 'Price: Low to High'
      },
      {
        value: 'price-desc',
        label: 'Price: High to Low'
      },
      {
        value: 'start-asc',
        label: 'Start Date'
      },
      {
        value: 'name-asc',
        label: 'Trip Name'
      }
    ];

    constructor(
      private tripData: TripData,
        private router: Router,
          private authentication: Authentication
    ) {}

    public ngOnInit(): void {
      this.searchTrips();
    }

    public addTrip(): void {
      this.router.navigate(['add-trip']);
    }

    public searchTrips(): void {
      this.errorMessage = '';

      if (
        this.criteria.minPrice !== null &&
        this.criteria.maxPrice !== null &&
        this.criteria.minPrice > this.criteria.maxPrice
      ) {
        this.errorMessage =
        'Minimum price cannot be greater than maximum price.';

      return;
      }

      this.isLoading = true;

      this.tripData
      .getTrips(this.criteria)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (trips: Trip[]) => {
          this.trips = trips;

          if (trips.length === 1) {
            this.message = '1 trip matched the selected criteria.';
          } else {
            this.message =
            `${trips.length} trips matched the selected criteria.`;
          }
        },
        error: (error) => {
          console.error(
            'Trip search failed.',
            error
          );

          this.trips = [];
          this.message = '';
          this.errorMessage =
          error?.error?.message ||
          'Trips could not be retrieved. Please try again.';
        }
      });
    }

    public clearSearch(): void {
      this.criteria = this.createDefaultCriteria();
      this.searchTrips();
    }

    public isLoggedIn(): boolean {
      return this.authentication.isLoggedIn();
    }

    private createDefaultCriteria(): TripSearchCriteria {
      return {
        keyword: '',
        resort: '',
        minPrice: null,
        maxPrice: null,
        nights: null,
        sort: 'relevance'
      };
    }
}
