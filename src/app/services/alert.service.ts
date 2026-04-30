import {Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

export interface AlertState {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly AUTO_DISMISS_MS = 3500;
  private readonly alertSignal = signal<AlertState | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  // Readonly signal for template binding
  readonly alert = this.alertSignal.asReadonly();
  // Observable alias kept for components using the async pipe
  readonly alert$ = toObservable(this.alertSignal);

  show(message: string, type: AlertState['type'] = 'success'): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    this.alertSignal.set({ message, type });
    this.dismissTimer = setTimeout(() => {
      this.alertSignal.set(null);
      this.dismissTimer = null;
    }, this.AUTO_DISMISS_MS);
  }

  clear(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.alertSignal.set(null);
  }
}
