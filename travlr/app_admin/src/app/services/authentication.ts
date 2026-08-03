import {
  Inject,
  Injectable
} from '@angular/core';

import {
  Observable,
  tap
} from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

/**
 * Shape of the JWT payload fields used by the Angular application.
 */
interface TokenPayload {
  _id?: string;
  email?: string;
  name?: string;
  role?: 'customer' | 'admin';
  exp?: number;
}

/**
 * Manages authentication requests and the JWT stored by the browser.
 */
@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private readonly tokenStorageKey = 'travlr-token';

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
              private tripData: TripData
  ) { }

  /**
   * Retrieves the JWT from browser storage.
   */
  public getToken(): string {
    return this.storage.getItem(this.tokenStorageKey) ?? '';
  }

  /**
   * Saves a JWT to browser storage.
   */
  public saveToken(token: string): void {
    this.storage.setItem(this.tokenStorageKey, token);
  }

  /**
   * Removes the JWT from browser storage.
   */
  public logout(): void {
    this.storage.removeItem(this.tokenStorageKey);
  }

  /**
   * Determines whether a valid, unexpired JWT is stored.
   *
   * Malformed tokens are removed rather than allowed to cause an
   * unhandled JSON or Base64 parsing error.
   */
  public isLoggedIn(): boolean {
    const payload = this.decodeToken(this.getToken());

    if (
      !payload ||
      typeof payload.exp !== 'number'
    ) {
      this.logout();
      return false;
    }

    const currentTimeInSeconds = Date.now() / 1000;
    const isValid = payload.exp > currentTimeInSeconds;

    if (!isValid) {
      this.logout();
    }

    return isValid;
  }

  /**
   * Retrieves identifying information from the stored token.
   *
   * This method should be called only after isLoggedIn() returns true.
   */
  public getCurrentUser(): User {
    const payload =
    this.decodeToken(
      this.getToken()
    );

    return {
      email: payload?.email ?? '',
      name: payload?.name ?? '',
      role: payload?.role ?? 'customer'
    } as User;
  }

  /**
   * Sends the login request and saves the returned token.
   *
   * The component subscribes to this observable so navigation and error
   * handling occur only after the asynchronous request completes.
   */
  public login(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.tripData.login(user, password).pipe(
      tap((response: AuthResponse) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  /**
   * Registers a new user and saves the token returned by the API.
   */
  public register(
    user: User,
    password: string
  ): Observable<AuthResponse> {
    return this.tripData.register(user, password).pipe(
      tap((response: AuthResponse) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  /**
   * Safely decodes the payload portion of a JWT.
   *
   * JWTs use Base64URL encoding, which differs slightly from the Base64
   * format expected by the browser's atob function.
   */
  private decodeToken(token: string): TokenPayload | null {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3 || !tokenParts[1]) {
      return null;
    }

    try {
      const base64 = tokenParts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

      const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
                                         '='
      );

      const decodedPayload = atob(paddedBase64);

      return JSON.parse(decodedPayload) as TokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Determines whether the current token belongs to an administrator.
   */
  public isAdmin(): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }

    const payload =
    this.decodeToken(
      this.getToken()
    );

    return payload?.role === 'admin';
  }
}
