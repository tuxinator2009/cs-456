import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input({ required: true })
  public trip!: Trip;

  constructor(
    private router: Router,
      private authentication: Authentication
  ) {}

  public editTrip(trip: Trip): void {
    localStorage.setItem(
      'tripCode',
      trip.code
    );

    this.router.navigate(['edit-trip']);
  }

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }
}
