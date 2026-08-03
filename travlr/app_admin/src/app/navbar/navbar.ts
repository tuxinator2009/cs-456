import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private authentication: Authentication,
      private router: Router
  ) {}

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public isAdmin(): boolean {
    return this.authentication.isAdmin();
  }

  public onLogout(): void {
    this.authentication.logout();
    this.router.navigate(['/']);
  }
}
