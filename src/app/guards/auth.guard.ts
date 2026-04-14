import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
/** Richiede almeno il login (admin O user) */
export const loginGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  auth.openLoginModal();
  router.navigate(['/dashboard']);
  return false;
};
/** Richiede ruolo admin */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin) return true;
  auth.openLoginModal();
  router.navigate(['/dashboard']);
  return false;
};
