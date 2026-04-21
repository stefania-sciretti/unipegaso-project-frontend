import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

/** Richiede almeno il login (admin O user) */
export const loginGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  auth.openLoginModal();
  try {
    // Await navigation instead of ignoring the returned Promise
    await router.navigate(['/dashboard']);
  } catch (err) {
    // Log unexpected navigation errors but still prevent activation
    console.error('Navigation error in loginGuard:', err);
  }
  return false;
};
/** Richiede ruolo admin */
export const adminGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin) return true;
  auth.openLoginModal();
  try {
    // Await navigation instead of ignoring the returned Promise
    await router.navigate(['/dashboard']);
  } catch (err) {
    console.error('Navigation error in adminGuard:', err);
  }
  return false;
};
