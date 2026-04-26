import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { ApiError } from '../models/models';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as ApiError | undefined;
      const message = apiError?.message ?? resolveDefaultMessage(error.status);
      alertService.show(message, 'error');
      return throwError(() => error);
    })
  );
};

function resolveDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Richiesta non valida.';
    case 404: return 'Risorsa non trovata.';
    case 409: return 'Operazione non consentita (conflitto).';
    case 500: return 'Errore interno del server.';
    default:  return 'Si è verificato un errore imprevisto.';
  }
}
