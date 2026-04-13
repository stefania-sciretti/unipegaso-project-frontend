import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning';
}

/**
 * Centralises alert notification logic (Single Responsibility Principle).
 *
 * Previously the `showAlert()` + `setTimeout()` pattern was duplicated in every
 * page component (ClientsComponent, AppointmentsComponent, NutritionComponent,
 * TrainingComponent, GlycemiaComponent). This service is the single source of truth.
 */
@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly AUTO_DISMISS_MS = 3500;
  private readonly alertSubject = new BehaviorSubject<AlertState | null>(null);

  readonly alert$: Observable<AlertState | null> = this.alertSubject.asObservable();

  show(message: string, type: AlertState['type'] = 'success'): void {
    this.alertSubject.next({ message, type });
    setTimeout(() => this.alertSubject.next(null), this.AUTO_DISMISS_MS);
  }

  clear(): void {
    this.alertSubject.next(null);
  }
}
