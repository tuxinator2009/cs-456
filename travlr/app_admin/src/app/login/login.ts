import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { finalize } from 'rxjs';

import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError = '';
  public submitted = false;

  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
      private route: ActivatedRoute,
        private authentication: Authentication
  ) { }

  /**
   * Validates the form and begins authentication.
   */
  public onLoginSubmit(): void {
    this.formError = '';

    if (
      !this.credentials.name.trim() ||
      !this.credentials.email.trim() ||
      !this.credentials.password
    ) {
      this.formError =
      'All fields are required. Please complete the form and try again.';

    return;
    }

    this.doLogin();
  }

  /**
   * Authenticates the user and navigates only after the asynchronous
   * login request succeeds.
   */
  private doLogin(): void {
    const user = {
      name: this.credentials.name.trim(),
      email: this.credentials.email.trim()
    } as User;

    this.submitted = true;

    this.authentication
    .login(user, this.credentials.password)
    .pipe(
      finalize(() => {
        this.submitted = false;
      })
    )
    .subscribe({
      next: (response) => {
        if (!response?.token) {
          this.formError =
          'The server did not return a valid authentication token.';

    return;
        }

        const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') || '/';

        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        console.error('Login failed.', error);

        if (error.status === 401) {
          this.formError =
          'The email address or password was not recognized.';
        } else {
          this.formError =
          'Login could not be completed. Please try again.';
        }
      }
    });
  }
}
