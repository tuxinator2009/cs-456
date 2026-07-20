import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';

import { Authentication } from '../services/authentication';

/**
 * Prevents unauthenticated users from accessing administrative routes.
 *
 * The Express API remains the authoritative security boundary. This
 * client-side guard improves navigation and provides defense in depth by
 * preventing users without a valid token from opening protected forms.
 */
export const authGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const authentication = inject(Authentication);
  const router = inject(Router);

  if (authentication.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );
};
