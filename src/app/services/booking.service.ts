import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface PendingBooking {
  clientId?: number;
  trainerId: number;
  scheduledAt: string;
  serviceType: string;
  visitType?: string;
  appointmentType: 'fitness' | 'clinical';
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly _pendingBooking = signal<PendingBooking | null>(null);

  // Observable alias kept for components using the async pipe
  readonly pendingBooking$ = toObservable(this._pendingBooking);

  get pendingBooking(): PendingBooking | null {
    return this._pendingBooking();
  }

  setPendingBooking(booking: PendingBooking): void {
    this._pendingBooking.set(booking);
  }

  clearPendingBooking(): void {
    this._pendingBooking.set(null);
  }
}
