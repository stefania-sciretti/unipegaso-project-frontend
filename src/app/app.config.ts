import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations'; // Modern version
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router'; // Modern version
import { routes } from './app.routes';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appProviders = [
  // 1. Modern Functional Providers (Do NOT wrap these in importProvidersFrom)
  provideRouter(routes), 
  provideHttpClient(withInterceptorsFromDi()), // Required to use class-based interceptors
  provideAnimations(),

  // 2. Class-based Interceptors
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];