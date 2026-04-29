import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';

export const appProviders = [
  provideRouter(routes),
  provideHttpClient(withInterceptors([jwtInterceptor, httpErrorInterceptor])),
  provideAnimationsAsync(),
];
