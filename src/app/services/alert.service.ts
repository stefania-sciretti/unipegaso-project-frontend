import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly AUTO_DISMISS_MS = 3500;
  private readonly alertSignal = signal<AlertState | null>(null);

  // Readonly signal for template binding
  readonly alert = this.alertSignal.asReadonly();
  // Observable alias kept for components using the async pipe
  readonly alert$ = toObservable(this.alertSignal);

  show(message: string, type: AlertState['type'] = 'success'): void {
    this.alertSignal.set({ message, type });
    setTimeout(() => this.alertSignal.set(null), this.AUTO_DISMISS_MS);
  }

  clear(): void {
    this.alertSignal.set(null);
  }
}
