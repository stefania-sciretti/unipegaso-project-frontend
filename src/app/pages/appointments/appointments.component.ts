import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { TrainerService } from '../../services/trainer.service';
import { Client, FitnessAppointment, FitnessAppointmentRequest, AppointmentStatus, Trainer } from '../../models/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: FitnessAppointment[] = [];
  clients: Client[] = [];
  trainers: Trainer[] = [];
  loading = false;
  alertMsg  = '';
  alertType = 'success';
  filterStatus = '';

  showApptModal   = false;
  showStatusModal = false;
  statusEditingId: number | null = null;
  apptForm!: FormGroup;
  statusForm!: FormGroup;

  readonly statuses: AppointmentStatus[] = ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  constructor(
    private svc: AppointmentService,
    private clientSvc: ClientService,
    private trainerSvc: TrainerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.route.queryParams.subscribe(p => { this.filterStatus = p['status'] ?? ''; this.load(); });
    forkJoin({ clients: this.clientSvc.getAll(), trainers: this.trainerSvc.getAll() })
      .subscribe(({ clients, trainers }) => { this.clients = clients; this.trainers = trainers; });
  }

  buildForms(): void {
    this.apptForm = this.fb.group({
      clientId:    [null, Validators.required],
      trainerId:   [null, Validators.required],
      scheduledAt: ['',   Validators.required],
      serviceType: ['',   Validators.required],
      notes:       ['']
    });
    this.statusForm = this.fb.group({ status: ['', Validators.required] });
  }

  load(): void {
    this.loading = true;
    const filters: { [key: string]: string } = this.filterStatus ? { status: this.filterStatus } : {};
    this.svc.getAll(filters).subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: (err) => { this.showAlert(err.error?.message || 'Load failed', 'error'); this.loading = false; }
    });
  }

  onStatusFilter(e: Event): void {
    this.filterStatus = (e.target as HTMLSelectElement).value;
    this.router.navigate([], { queryParams: this.filterStatus ? { status: this.filterStatus } : {}, replaceUrl: true });
    this.load();
  }

  openCreate(): void { this.apptForm.reset(); this.showApptModal = true; }

  saveAppointment(): void {
    if (this.apptForm.invalid) { this.apptForm.markAllAsTouched(); return; }
    const v = this.apptForm.value;
    const body: FitnessAppointmentRequest = {
      clientId: +v.clientId, trainerId: +v.trainerId,
      scheduledAt: v.scheduledAt, serviceType: v.serviceType,
      notes: v.notes || null
    };
    this.svc.create(body).subscribe({
      next: () => { this.showAlert('Appuntamento prenotato!'); this.showApptModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Errore durante la prenotazione', 'error')
    });
  }

  openStatusModal(a: FitnessAppointment): void {
    this.statusEditingId = a.id;
    this.statusForm.patchValue({ status: a.status });
    this.showStatusModal = true;
  }

  saveStatus(): void {
    if (!this.statusEditingId) return;
    this.svc.updateStatus(this.statusEditingId, this.statusForm.value.status).subscribe({
      next: () => { this.showAlert('Stato aggiornato!'); this.showStatusModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Errore aggiornamento stato', 'error')
    });
  }

  cancel(id: number): void {
    if (!confirm('Annullare questo appuntamento?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.showAlert('Appuntamento annullato.'); this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Errore durante l\'annullamento', 'error')
    });
  }

  canCancel(a: FitnessAppointment): boolean {
    return a.status === 'BOOKED' || a.status === 'CONFIRMED';
  }

  statusClass(s: string): string { return `badge badge-${s.toLowerCase()}`; }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      BOOKED: 'Prenotato', CONFIRMED: 'Confermato',
      COMPLETED: 'Completato', CANCELLED: 'Annullato'
    };
    return map[s] ?? s;
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const c = form.get(field); return !!(c && c.invalid && c.touched);
  }

  showAlert(msg: string, type = 'success'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => this.alertMsg = '', 3500);
  }
}
