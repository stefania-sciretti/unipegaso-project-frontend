import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Modern version
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router'; // Modern version
import { routes } from './app.routes';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appProviders = [
  provideZonelessChangeDetection(),
  provideRouter(routes), 
  provideHttpClient(withInterceptorsFromDi()), // Required to use class-based interceptors
  provideAnimationsAsync(),

  // 2. Class-based Interceptors
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];