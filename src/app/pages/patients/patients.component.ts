import { Component, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient, PatientRequest, PatientService } from '../../services/patient.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-patients',
  imports: [ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './patients.component.html'
})
export class PatientsComponent {
  private readonly patientService = inject(PatientService);
  private readonly alertSvc       = inject(AlertService);
  private readonly fb             = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  patients: Patient[] = [];
  loading             = false;
  showModal           = false;
  editingId: number | null = null;

  readonly form: FormGroup = this.fb.group({
    firstName:  ['', Validators.required],
    lastName:   ['', Validators.required],
    fiscalCode: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
    birthDate:  ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    phone:      ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.patientService.getAll().subscribe({
      next: data => { this.patients = data; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }

  openEdit(patient: Patient): void {
    this.editingId = patient.id;
    this.form.patchValue({
      firstName:  patient.firstName,
      lastName:   patient.lastName,
      fiscalCode: patient.fiscalCode,
      birthDate:  patient.birthDate,
      email:      patient.email,
      phone:      patient.phone ?? ''
    });
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: PatientRequest = {
      firstName:  value.firstName,
      lastName:   value.lastName,
      fiscalCode: value.fiscalCode.toUpperCase(),
      birthDate:  value.birthDate,
      email:      value.email,
      phone:      value.phone || null
    };
    const req$ = this.editingId ? this.patientService.update(this.editingId, body) : this.patientService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Paziente aggiornato' : 'Paziente creato');
        this.closeModal();
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questo paziente?')) return;
    this.patientService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Paziente eliminato'); this.load(); }
    });
  }

  onSearch(e: Event): void {
    const query = (e.target as HTMLInputElement).value.trim();
    if (!query) { this.load(); return; }
    this.loading = true;
    this.patientService.search(query).subscribe({
      next: (data: Patient[]) => { this.patients = data; this.loading = false; },
      error: ()               => { this.loading = false; }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
