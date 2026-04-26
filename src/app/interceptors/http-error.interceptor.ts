import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertService} from '../services/alert.service';
import {ApiError} from '../models/models';

/**
 * Intercepts all HTTP errors and notifies the AlertService with a meaningful message.
 *
 * Applying the Dependency Inversion Principle: page components no longer need to
 * handle `err.error?.message || 'fallback'` inline — that responsibility lives here.
 *
 * Register in AppModule/providers via:
 *   { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = error.error as ApiError | undefined;
        const message = apiError?.message ?? this.resolveDefaultMessage(error.status);
        this.alertService.show(message, 'error');
        return throwError(() => error);
      })
    );
  }

  private resolveDefaultMessage(status: number): string {
    switch (status) {
      case 400: return 'Richiesta non valida.';
      case 404: return 'Risorsa non trovata.';
      case 409: return 'Operazione non consentita (conflitto).';
      case 500: return 'Errore interno del server.';
      default:  return 'Si è verificato un errore imprevisto.';
    }
  }
}
