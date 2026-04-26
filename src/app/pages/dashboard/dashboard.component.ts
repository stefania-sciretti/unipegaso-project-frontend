import {Component} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AppointmentService} from '../../services/appointment.service';
import {ClinicalAppointmentService} from '../../services/clinical-appointment.service';
import {AuthService} from '../../services/auth.service';
import {BookingService, PendingBooking} from '../../services/booking.service';

interface Service {
  id: string;
  name: string;
  icon: string;
  appointmentType?: string;
}

interface ServiceArea {
  id: string;
  label: string;
  icon: string;
  services: Service[];
}

interface Doctor {
  id: number;
  name: string;
  title: string;
  icon: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NgOptimizedImage, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedArea: ServiceArea | null = null;
  selectedService: Service | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  minDate: string = '';
  maxDate: string = '';
  bookingLoading = false;
  showAreaDropdown = false;
  currentMonth: Date = new Date();

  private staffMapping: {[key: string]: number} = {
    'sandro': 1,
    'simona': 2,
    'cristiana': 3,
    'mihai': 4,
    'luca': 5
  };

  doctors: {[key: string]: Doctor} = {
    'sandro': { id: 1, name: 'Dott. Sandro Scrigoni', title: 'Medico dello Sport', icon: 'medical_services' },
    'simona': { id: 2, name: 'Dott.ssa Simona Ruberti', title: 'Biologa Nutrizionista', icon: 'restaurant_menu' },
    'cristiana': { id: 3, name: 'Dott.ssa Cristiana Maratti', title: 'Nutrizionista Sportiva', icon: 'restaurant_menu' },
    'mihai': { id: 4, name: 'Dott. Mihai Lavretti', title: 'Osteopata', icon: 'back_hand' },
    'luca': { id: 5, name: 'Dott. Luca Siretta', title: 'Personal Trainer ISSA', icon: 'fitness_center' }
  };

  serviceAreas: ServiceArea[] = [
    {
      id: 'clinica',
      label: 'Area Clinica',
      icon: 'medical_services',
      services: [
        { id: 'clinica-1', name: 'Visita di Idoneità Sportiva', icon: 'assignment', appointmentType: 'clinical' },
        { id: 'clinica-2', name: 'Trattamento Infortuni Sportivi', icon: 'healing', appointmentType: 'clinical' },
        { id: 'clinica-3', name: 'Test da Sforzo', icon: 'speed', appointmentType: 'clinical' },
        { id: 'clinica-4', name: 'Prevenzione Infortuni', icon: 'shield', appointmentType: 'clinical' },
        { id: 'clinica-5', name: 'Terapia Infiltrativa', icon: 'medical_services', appointmentType: 'clinical' },
        { id: 'clinica-6', name: 'Ottimizzazione della Performance', icon: 'trending_up', appointmentType: 'clinical' },
      ]
    },
    {
      id: 'nutrizione',
      label: 'Area Nutrizione',
      icon: 'restaurant_menu',
      services: [
        { id: 'nutri-1', name: 'Piano Alimentare Personalizzato', icon: 'restaurant_menu', appointmentType: 'fitness' },
        { id: 'nutri-2', name: 'Analisi Composizione Corporea (BIA)', icon: 'monitor_weight', appointmentType: 'fitness' },
        { id: 'nutri-3', name: 'Nutrizione Clinica', icon: 'favorite', appointmentType: 'fitness' },
        { id: 'nutri-4', name: 'Nutrizione Sportiva e Performance', icon: 'bolt', appointmentType: 'fitness' },
        { id: 'nutri-5', name: 'Gestione dell\'Idratazione', icon: 'water_drop', appointmentType: 'fitness' },
        { id: 'nutri-6', name: 'Educazione Alimentare', icon: 'groups', appointmentType: 'fitness' },
      ]
    },
    {
      id: 'osteopatia',
      label: 'Area Osteopatia',
      icon: 'back_hand',
      services: [
        { id: 'osteo-1', name: 'Manipolazione Osteopatica', icon: 'back_hand', appointmentType: 'fitness' },
        { id: 'osteo-2', name: 'Trattamento del Mal di Schiena', icon: 'airline_seat_flat', appointmentType: 'fitness' },
        { id: 'osteo-3', name: 'Osteopatia in Gravidanza', icon: 'pregnant_woman', appointmentType: 'fitness' },
        { id: 'osteo-4', name: 'Osteopatia Pediatrica', icon: 'child_care', appointmentType: 'fitness' },
        { id: 'osteo-5', name: 'Osteopatia Sportiva', icon: 'sports_handball', appointmentType: 'fitness' },
        { id: 'osteo-6', name: 'Trattamento Cefalee ed Emicranie', icon: 'sentiment_very_satisfied', appointmentType: 'fitness' },
      ]
    },
    {
      id: 'sport',
      label: 'Area Sport',
      icon: 'fitness_center',
      services: [
        { id: 'sport-1', name: 'Personal Training', icon: 'fitness_center', appointmentType: 'fitness' },
        { id: 'sport-2', name: 'Allenamento Funzionale', icon: 'directions_run', appointmentType: 'fitness' },
        { id: 'sport-3', name: 'Preparazione Atletica', icon: 'sports', appointmentType: 'fitness' },
        { id: 'sport-4', name: 'Programma Dimagrimento', icon: 'self_improvement', appointmentType: 'fitness' },
        { id: 'sport-5', name: 'Tonificazione Muscolare', icon: 'accessibility_new', appointmentType: 'fitness' },
        { id: 'sport-6', name: 'Coaching Motivazionale', icon: 'psychology', appointmentType: 'fitness' },
      ]
    }
  ];

  constructor(
    private router: Router,
    private appointmentSvc: AppointmentService,
    private clinicalAppointmentSvc: ClinicalAppointmentService,
    private auth: AuthService,
    private bookingSvc: BookingService
  ) {
    this.initDateRange();
  }

  private initDateRange(): void {
    const today = new Date();
    this.minDate = this.formatDateForInput(today);
    const maxDateObj = new Date(today);
    maxDateObj.setMonth(maxDateObj.getMonth() + 4);
    this.maxDate = this.formatDateForInput(maxDateObj);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectArea(area: ServiceArea): void {
    this.selectedArea = area;
    this.selectedService = null;
  }

  backToAreas(): void {
    this.selectedArea = null;
    this.selectedService = null;
  }

  selectService(service: Service): void {
    this.selectedService = service;
  }

  getCalendarDays(): number[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: number[] = [];
    // Add empty days for the start of the week
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(0);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
  }

  selectCalendarDate(day: number): void {
    if (day === 0 || this.isDateDisabled(day)) return;
    const year = this.currentMonth.getFullYear();
    const month = String(this.currentMonth.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    this.selectedDate = `${year}-${month}-${date}`;
  }

  isDateSelected(day: number): boolean {
    if (day === 0) return false;
    const year = this.currentMonth.getFullYear();
    const month = String(this.currentMonth.getMonth() + 1).padStart(2, '0');
    const date = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;
    return this.selectedDate === dateStr;
  }

  isDateDisabled(day: number): boolean {
    if (day === 0) return true;
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable today and all past dates
    return date <= today;
  }

  getSelectedDoctor(): Doctor | null {
    if (!this.selectedArea) return null;
    const doctorKey = this.selectedArea.id === 'nutrizione'
      ? (Math.random() > 0.5 ? 'simona' : 'cristiana')
      : this.selectedArea.id === 'osteopatia' ? 'mihai'
      : this.selectedArea.id === 'sport' ? 'luca'
      : 'sandro';
    return this.doctors[doctorKey] || null;
  }

  getAvailableSlots(): string[] {
    const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

    // If no date selected, return empty
    if (!this.selectedDate) return [];

    const today = new Date();
    const selectedDate = new Date(`${this.selectedDate}T00:00:00`);

    // If selected date is today or in the past, return empty
    if (selectedDate <= today) return [];

    // If selected date is in the future (tomorrow or later), return all slots
    return allSlots;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  bookAppointment(): void {
    if (!this.selectedService || !this.selectedDate || !this.selectedTime) {
      alert('Per favore completa tutti i campi');
      return;
    }

    // Prevent booking for today or in the past
    const selectedDateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateTime <= today) {
      alert('Non puoi prenotare per oggi. Scegli una data da domani in poi');
      return;
    }

    // If not logged in, save booking and open login modal
    if (!this.auth.currentUser) {
      let trainerId: number = 1;
      if (this.selectedArea?.id === 'nutrizione') {
        trainerId = Math.random() > 0.5 ? this.staffMapping['simona'] : this.staffMapping['cristiana'];
      } else if (this.selectedArea?.id === 'osteopatia') {
        trainerId = this.staffMapping['mihai'];
      } else if (this.selectedArea?.id === 'sport') {
        trainerId = this.staffMapping['luca'];
      } else if (this.selectedArea?.id === 'clinica') {
        trainerId = this.staffMapping['sandro'];
      }

      const appointmentDateTime = `${this.selectedDate}T${this.selectedTime}:00`;

      const pendingBooking: PendingBooking = {
        trainerId: trainerId,
        scheduledAt: appointmentDateTime,
        serviceType: this.selectedService.name,
        appointmentType: this.selectedService.appointmentType as 'fitness' | 'clinical',
        visitType: this.selectedService.appointmentType === 'clinical' ? this.selectedService.name : undefined
      };

      this.bookingSvc.setPendingBooking(pendingBooking);
      this.auth.openLoginModal();
      return;
    }

    this.bookingLoading = true;

    let trainerId: number = 1;
    if (this.selectedArea?.id === 'nutrizione') {
      trainerId = Math.random() > 0.5 ? this.staffMapping['simona'] : this.staffMapping['cristiana'];
    } else if (this.selectedArea?.id === 'osteopatia') {
      trainerId = this.staffMapping['mihai'];
    } else if (this.selectedArea?.id === 'sport') {
      trainerId = this.staffMapping['luca'];
    } else if (this.selectedArea?.id === 'clinica') {
      trainerId = this.staffMapping['sandro'];
    }

    const appointmentDateTime = `${this.selectedDate}T${this.selectedTime}:00`;

    if (this.selectedService.appointmentType === 'clinical') {
      console.log('Booking clinical appointment:', {
        patientId: this.auth.currentUser.id,
        doctorId: trainerId,
        scheduledAt: appointmentDateTime,
        visitType: this.selectedService.name
      });
      this.bookingLoading = false;
      alert(`Prenotazione confermata per ${this.selectedService?.name} il ${this.formatDateDisplay(this.selectedDate)} alle ${this.selectedTime}`);
      this.resetForm();
    } else {
      const bookingRequest = {
        clientId: this.auth.currentUser.id,
        trainerId: trainerId,
        scheduledAt: appointmentDateTime,
        serviceType: this.selectedService.name
      };

      this.appointmentSvc.create(bookingRequest).subscribe({
        next: () => {
          this.bookingLoading = false;
          alert(`Prenotazione confermata per ${this.selectedService?.name} il ${this.formatDateDisplay(this.selectedDate)} alle ${this.selectedTime}`);
          this.resetForm();
        },
        error: (err: any) => {
          this.bookingLoading = false;
          alert('Errore nella prenotazione: ' + (err.error?.message || 'Riprova più tardi'));
        }
      });
    }
  }

  private formatDateDisplay(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  private resetForm(): void {
    this.selectedArea = null;
    this.selectedService = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.showAreaDropdown = false;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
