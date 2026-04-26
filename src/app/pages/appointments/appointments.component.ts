import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {AppointmentService} from '../../services/appointment.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {AppointmentStatus, Client, FitnessAppointment, FitnessAppointmentRequest, Staff} from '../../models/models';

@Component({
    selector: 'app-appointments',
    imports: [
        CommonModule, AsyncPipe, ReactiveFormsModule, FormsModule, MatIconModule
    ],
    templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: FitnessAppointment[] = [];
  clients: Client[] = [];
  trainers: Staff[] = [];
  loading = false;
  filterStatus = '';
  readonly alert$: Observable<AlertState | null>;

  showApptModal   = false;
  showStatusModal = false;
  statusEditingId: number | null = null;
  apptForm!: FormGroup;
  statusForm!: FormGroup;

  // custom dropdown clienti
  clientDropdownOpen = false;
  clientSearch = '';
  selectedClientLabel = '';
  selectedSpecialistLabel = '';

  get filteredClients(): Client[] {
    const q = this.clientSearch.toLowerCase();
    return this.clients.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  }

  selectClient(c: Client): void {
    this.apptForm.patchValue({ clientId: c.id });
    this.selectedClientLabel = `${c.firstName} ${c.lastName}`;
    this.clientDropdownOpen = false;
    this.clientSearch = '';
  }

  openClientDropdown(): void {
    this.clientDropdownOpen = true;
    this.clientSearch = '';
  }

  readonly statuses: AppointmentStatus[] = ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  private readonly statusLabels: Record<string, string> = {
    BOOKED: 'Prenotato', CONFIRMED: 'Confermato',
    COMPLETED: 'Completato', CANCELLED: 'Annullato'
  };

  constructor(
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private trainerService: StaffService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef
  ) {
    this.alert$ = this.alertService.alert$;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.clientDropdownOpen && !this.el.nativeElement.querySelector('.custom-dropdown')?.contains(event.target)) {
      this.clientDropdownOpen = false;
      this.clientSearch = '';
    }
  }

  ngOnInit(): void {
    this.buildForms();
    this.route.queryParams.subscribe(params => {
      this.filterStatus = params['status'] ?? '';
      this.load();
    });
    forkJoin({ clients: this.clientService.getAll(), trainers: this.trainerService.getAll() })
      .subscribe(({ clients, trainers }) => { this.clients = clients; this.trainers = trainers; });
  }

  buildForms(): void {
    this.apptForm = this.fb.group({
      clientId:    [null, Validators.required],
      trainerId:   ['',   Validators.required],
      scheduledAt: ['',   Validators.required],
      serviceType: ['',   Validators.required],
      notes:       ['']
    });
    this.statusForm = this.fb.group({ status: ['', Validators.required] });
  }

  load(): void {
    this.loading = true;
    const filters: { [key: string]: string } = this.filterStatus ? { status: this.filterStatus } : {};
    this.appointmentService.getAll(filters).subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onStatusFilter(e: Event): void {
    this.filterStatus = (e.target as HTMLSelectElement).value;
    this.router.navigate([], {
      queryParams: this.filterStatus ? { status: this.filterStatus } : {},
      replaceUrl: true
    });
    this.load();
  }

  openCreate(): void { this.apptForm.reset(); this.selectedClientLabel = ''; this.clientDropdownOpen = false; this.showApptModal = true; }

  saveAppointment(): void {
    if (this.apptForm.invalid) { this.apptForm.markAllAsTouched(); return; }
    const value = this.apptForm.value;
    // datetime-local restituisce "2026-04-09T18:00", il backend si aspetta "2026-04-09T18:00:00"
    const scheduledAt = value.scheduledAt?.length === 16 ? value.scheduledAt + ':00' : value.scheduledAt;
    const body: FitnessAppointmentRequest = {
      clientId:    +value.clientId,
      trainerId:   +value.trainerId,
      scheduledAt: scheduledAt,
      serviceType: value.serviceType,
      notes:       value.notes || null
    };
    this.appointmentService.create(body).subscribe({
      next: () => { this.alertService.show('Appuntamento prenotato!'); this.showApptModal = false; this.load(); }
    });
  }

  openStatusModal(appointment: FitnessAppointment): void {
    this.statusEditingId = appointment.id;
    this.statusForm.patchValue({ status: appointment.status });
    this.showStatusModal = true;
  }

  saveStatus(): void {
    if (!this.statusEditingId) return;
    this.appointmentService.updateStatus(this.statusEditingId, this.statusForm.value.status).subscribe({
      next: () => { this.alertService.show('Stato aggiornato!'); this.showStatusModal = false; this.load(); }
    });
  }

  cancel(id: number): void {
    if (!confirm('Annullare questo appuntamento?')) return;
    this.appointmentService.delete(id).subscribe({
      next: () => { this.alertService.show('Appuntamento annullato.'); this.load(); }
    });
  }

  canCancel(appointment: FitnessAppointment): boolean {
    return appointment.status === 'BOOKED' || appointment.status === 'CONFIRMED';
  }

  private readonly roleLabels: Record<string, string> = {
    NUTRITIONIST:       'Biologa Nutrizionista',
    PERSONAL_TRAINER:   'Personal Trainer',
    SPORTS_DOCTOR:      'Medico dello Sport',
    OSTEOPATH:          'Osteopata',
    SPORTS_NUTRITIONIST:'Nutrizionista Sportiva'
  };

  roleLabel(role: string): string {
    return this.roleLabels[role] ?? role;
  }

  statusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  statusClass(status: string): string {
    return `badge badge-${status.toLowerCase()}`;
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
