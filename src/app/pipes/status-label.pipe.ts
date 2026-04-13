import {Pipe, PipeTransform} from '@angular/core';
import {AppointmentStatus} from '../models/models';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  BOOKED:    'Prenotato',
  CONFIRMED: 'Confermato',
  COMPLETED: 'Completato',
  CANCELLED: 'Annullato'
};

/**
 * Transforms an AppointmentStatus code into a human-readable Italian label.
 *
 * Extracted from AppointmentsComponent.statusLabel() (Single Responsibility Principle).
 * Using a Pipe instead of a component method avoids recalculations and enables reuse.
 *
 * Usage: {{ appointment.status | statusLabel }}
 */
@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    return STATUS_LABELS[status as AppointmentStatus] ?? status;
  }
}
