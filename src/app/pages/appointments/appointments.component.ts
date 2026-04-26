import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { StaffService } from '../../services/trainer.service';
import { AlertService } from '../../services/alert.service';
import { AppointmentStatus, Client, FitnessAppointment, FitnessAppointmentRequest, Staff } from '../../models/models';

@Component({
  selector: 'app-appointments',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, NgClass, MatIconModule],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly clientService      = inject(ClientService);
  private readonly trainerService     = inject(StaffService);
  private readonly alertSvc           = inject(AlertService);
  private readonly fb                 = inject(FormBuilder);
  private readonly route              = inject(ActivatedRoute);
  private readonly router             = inject(Router);
  private readonly el                 = inject(ElementRef);

  protected readonly alertSignal = this.alertSvc.alert;

  appointments: FitnessAppointment[] = [];
  clients: Client[]  = [];
  trainers: Staff[]  = [];
  loading            = false;
  filterStatus       = '';
  showApptModal      = false;
  showStatusModal    = false;
  statusEditingId: number | null = null;

  clientDropdownOpen     = false;
  clientSearch           = '';
  selectedClientLabel    = '';
  selectedSpecialistLabel = '';

  readonly statuses: AppointmentStatus[] = ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  private readonly statusLabels: Record<string, string> = {
    BOOKED: 'Prenotato', CONFIRMED: 'Confermato',
    COMPLETED: 'Completato', CANCELLED: 'Annullato'
  };

  readonly apptForm: FormGroup   = this.fb.group({
    clientId:    [null, Validators.required],
    trainerId:   ['',   Validators.required],
    scheduledAt: ['',   Validators.required],
    serviceType: ['',   Validators.required],
    notes:       ['']
  });
  readonly statusForm: FormGroup = this.fb.group({ status: ['', Validators.required] });

  get filteredClients(): Client[] {
    const q = this.clientSearch.toLowerCase();
    return this.clients.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q));
  }

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.filterStatus = params['status'] ?? '';
      this.load();
    });
    forkJoin({ clients: this.clientService.getAll(), trainers: this.trainerService.getAll() })
      .subscribe(({ clients, trainers }) => { this.clients = clients; this.trainers = trainers; });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.clientDropdownOpen && !this.el.nativeElement.querySelector('.custom-dropdown')?.contains(event.target)) {
      this.clientDropdownOpen = false;
      this.clientSearch = '';
    }
  }

  selectClient(c: Client): void {
    this.apptForm.patchValue({ clientId: c.id });
    this.selectedClientLabel = `${c.firstName} ${c.lastName}`;
    this.clientDropdownOpen  = false;
    this.clientSearch        = '';
  }

  openClientDropdown(): void { this.clientDropdownOpen = true; this.clientSearch = ''; }

  load(): void {
    this.loading = true;
    const filters: { [key: string]: string } = this.filterStatus ? { status: this.filterStatus } : {};
    this.appointmentService.getAll(filters).subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: ()    => { this.loading = false; }
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

  openCreate(): void {
    this.apptForm.reset();
    this.selectedClientLabel = '';
    this.clientDropdownOpen  = false;
    this.showApptModal       = true;
  }

  saveAppointment(): void {
    if (this.apptForm.invalid) { this.apptForm.markAllAsTouched(); return; }
    const value = this.apptForm.value;
    const scheduledAt = value.scheduledAt?.length === 16 ? value.scheduledAt + ':00' : value.scheduledAt;
    const body: FitnessAppointmentRequest = {
      clientId:    +value.clientId,
      trainerId:   +value.trainerId,
      scheduledAt,
      serviceType: value.serviceType,
      notes:       value.notes || null
    };
    this.appointmentService.create(body).subscribe({
      next: () => { this.alertSvc.show('Appuntamento prenotato!'); this.showApptModal = false; this.load(); }
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
      next: () => { this.alertSvc.show('Stato aggiornato!'); this.showStatusModal = false; this.load(); }
    });
  }

  cancel(id: number): void {
    if (!confirm('Annullare questo appuntamento?')) return;
    this.appointmentService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Appuntamento annullato.'); this.load(); }
    });
  }

  canCancel(appointment: FitnessAppointment): boolean {
    return appointment.status === 'BOOKED' || appointment.status === 'CONFIRMED';
  }

  private readonly roleLabels: Record<string, string> = {
    NUTRITIONIST:        'Biologa Nutrizionista',
    PERSONAL_TRAINER:    'Personal Trainer',
    SPORTS_DOCTOR:       'Medico dello Sport',
    OSTEOPATH:           'Osteopata',
    SPORTS_NUTRITIONIST: 'Nutrizionista Sportiva'
  };

  roleLabel(role: string): string   { return this.roleLabels[role] ?? role; }
  statusLabel(status: string): string { return this.statusLabels[status] ?? status; }
  statusClass(status: string): string {
    const base = 'inline-block px-[0.65rem] py-[0.2rem] rounded-xl text-[0.75rem] font-bold uppercase tracking-[0.5px]';
    const colors: Record<string, string> = {
      booked:    'bg-[#ddeefa] text-[#1a5680]',
      confirmed: 'bg-[#d4f0e0] text-[#1e7a48]',
      completed: 'bg-[#e8f4fd] text-[#112D4E]',
      cancelled: 'bg-[#fde8e8] text-[#d95550]',
    };
    return `${base} ${colors[status.toLowerCase()] ?? 'bg-[#f0f0f0] text-[#555]'}`;
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
