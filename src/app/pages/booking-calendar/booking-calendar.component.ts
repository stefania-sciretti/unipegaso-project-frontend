import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { ClinicalAppointmentService } from '../../services/clinical-appointment.service';

interface BookingEvent {
  id: number;
  type: 'fitness' | 'clinical';
  title: string;
  start: Date;
  specialistName: string;
  patientName: string;
  serviceType: string;
  status: string;
}

@Component({
  selector: 'app-booking-calendar',
  imports: [DatePipe, NgClass],
  templateUrl: './booking-calendar.component.html'
})
export class BookingCalendarComponent implements OnInit {
  private readonly appointmentSvc = inject(AppointmentService);
  private readonly clinicalSvc    = inject(ClinicalAppointmentService);
  private readonly datePipe       = inject(DatePipe);
  private readonly today          = new Date();

  viewMode: 'month' | 'week' = 'month';
  currentDate: Date = new Date();
  events: BookingEvent[] = [];
  loading = true;
  loadError = false;
  selectedEvent: BookingEvent | null = null;

  private readonly statusLabels: Record<string, string> = {
    BOOKED: 'Prenotato', CONFIRMED: 'Confermato',
    COMPLETED: 'Completato', CANCELLED: 'Annullato',
    SCHEDULED: 'Programmato', PENDING: 'In attesa'
  };

  readonly dayLabels = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  readonly dayLabelsLong = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = false;

    forkJoin({
      fitness:  this.appointmentSvc.getAll().pipe(catchError(() => { this.loadError = true; return of([]); })),
      clinical: this.clinicalSvc.getAll().pipe(catchError(() => { this.loadError = true; return of([]); }))
    }).subscribe({
      next: ({ fitness, clinical }) => {
        const fitnessEvents: BookingEvent[] = fitness.map(a => ({
          id: a.id,
          type: 'fitness' as const,
          title: `${a.serviceType}`,
          start: new Date(a.scheduledAt),
          specialistName: a.trainerFullName,
          patientName: a.clientFullName,
          serviceType: a.serviceType,
          status: a.status
        }));

        const clinicalEvents: BookingEvent[] = clinical.map(a => ({
          id: a.id,
          type: 'clinical' as const,
          title: `${a.visitType}`,
          start: new Date(a.scheduledAt),
          specialistName: a.doctorFullName,
          patientName: a.patientFullName,
          serviceType: a.visitType,
          status: a.status
        }));

        this.events = [...fitnessEvents, ...clinicalEvents]
          .sort((a, b) => a.start.getTime() - b.start.getTime());
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  getCalendarDays(): number[] {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: number[] = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(0);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(0);
    return days;
  }

  getEventsForMonthDay(day: number): BookingEvent[] {
    if (day === 0) return [];
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth();
    return this.events.filter(e =>
      e.start.getFullYear() === y &&
      e.start.getMonth()    === m &&
      e.start.getDate()     === day
    );
  }

  isToday(day: number): boolean {
    if (day === 0) return false;
    return (
      this.today.getFullYear() === this.currentDate.getFullYear() &&
      this.today.getMonth()    === this.currentDate.getMonth()    &&
      this.today.getDate()     === day
    );
  }

  get weekDays(): Date[] {
    const ref  = new Date(this.currentDate);
    const day  = ref.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    ref.setDate(ref.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      return d;
    });
  }

  getEventsForWeekDay(date: Date): BookingEvent[] {
    return this.events.filter(e =>
      e.start.getFullYear() === date.getFullYear() &&
      e.start.getMonth()    === date.getMonth()    &&
      e.start.getDate()     === date.getDate()
    );
  }

  isWeekDayToday(date: Date): boolean {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth()    === now.getMonth()    &&
      date.getDate()     === now.getDate()
    );
  }

  get weekLabel(): string {
    const days  = this.weekDays;
    const start = days[0];
    const end   = days[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${this.datePipe.transform(end, 'd MMM yyyy', '', 'it-IT') ?? ''}`;
    }
    return `${this.datePipe.transform(start, 'd MMM', '', 'it-IT') ?? ''} – ${this.datePipe.transform(end, 'd MMM yyyy', '', 'it-IT') ?? ''}`;
  }

  previousPeriod(): void {
    const d = new Date(this.currentDate);
    if (this.viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else {
      d.setDate(d.getDate() - 7);
    }
    this.currentDate = d;
  }

  nextPeriod(): void {
    const d = new Date(this.currentDate);
    if (this.viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setDate(d.getDate() + 7);
    }
    this.currentDate = d;
  }

  goToToday(): void { this.currentDate = new Date(); }

  openEvent(event: BookingEvent): void  { this.selectedEvent = event; }
  closePopover(): void                  { this.selectedEvent = null; }

  statusLabel(s: string): string { return this.statusLabels[s] ?? s; }

  eventColorClass(type: 'fitness' | 'clinical'): string {
    return type === 'fitness'
      ? 'bg-[#3F72AF] text-white'
      : 'bg-[#4CAF50] text-white';
  }

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      BOOKED:    'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
      SCHEDULED: 'bg-purple-100 text-purple-800',
      PENDING:   'bg-yellow-100 text-yellow-800',
    };
    return `inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`;
  }
}
