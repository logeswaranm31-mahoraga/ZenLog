import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from './auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth:Authentication = inject(Authentication)
  const router:Router = inject(Router)
  if (!auth.isLoggedIn) {
    router.navigate(['/auth'])
  }
  return true;
};
