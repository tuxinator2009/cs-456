import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';

import { Authentication } from '../services/authentication';

export const adminGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const authentication =
  inject(Authentication);

  const router =
  inject(Router);

  if (!authentication.isLoggedIn()) {
    return router.createUrlTree(
      ['/login'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }

  if (!authentication.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
