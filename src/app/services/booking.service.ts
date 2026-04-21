import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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
  private _pendingBooking = new BehaviorSubject<PendingBooking | null>(null);
  readonly pendingBooking$ = this._pendingBooking.asObservable();

  get pendingBooking(): PendingBooking | null {
    return this._pendingBooking.getValue();
  }

  setPendingBooking(booking: PendingBooking): void {
    this._pendingBooking.next(booking);
  }

  clearPendingBooking(): void {
    this._pendingBooking.next(null);
  }
}
