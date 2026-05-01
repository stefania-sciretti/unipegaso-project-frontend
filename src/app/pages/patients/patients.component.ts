import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient, PatientRequest } from '../../models/models';
import { PatientService } from '../../services/patient.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly alertSvc       = inject(AlertService);
  private readonly fb             = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  protected readonly patients   = signal<Patient[]>([]);
  protected readonly loading    = signal(false);
  protected readonly hasError   = signal(false);
  protected readonly showModal  = signal(false);
  protected readonly editingId  = signal<number | null>(null);
  private   readonly searchQuery = signal('');

  readonly form: FormGroup = this.fb.group({
    firstName:  ['', Validators.required],
    lastName:   ['', Validators.required],
    fiscalCode: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
    birthDate:  ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    phone:      ['']
  });

  constructor() {}

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading.set(true);
    this.hasError.set(false);
    const query = this.searchQuery();
    const req$ = query ? this.patientService.search(query) : this.patientService.getAll();
    req$.subscribe({
      next:  (data) => { this.patients.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); this.hasError.set(true); }
    });
  }

  openCreate(): void { this.editingId.set(null); this.form.reset(); this.showModal.set(true); }

  openEdit(patient: Patient): void {
    this.editingId.set(patient.id);
    this.form.patchValue({
      firstName:  patient.firstName,
      lastName:   patient.lastName,
      fiscalCode: patient.fiscalCode,
      birthDate:  patient.birthDate,
      email:      patient.email,
      phone:      patient.phone ?? ''
    });
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

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
    const id = this.editingId();
    const req$ = id ? this.patientService.update(id, body) : this.patientService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(id ? 'Paziente aggiornato' : 'Paziente creato');
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
    this.searchQuery.set((e.target as HTMLInputElement).value.trim());
    this.load();
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
