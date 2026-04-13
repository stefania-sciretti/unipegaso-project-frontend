import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Patient, PatientRequest, PatientService} from '../../services/patient.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  showModal = false;
  editingId: number | null = null;
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;
  constructor(
    private patientService: PatientService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }
  ngOnInit(): void { this.buildForm(); this.load(); }
  load(): void { this.loading = true; this.patientService.getAll().subscribe({ next: data => { this.patients = data; this.loading = false; }, error: () => { this.loading = false; } }); }
  buildForm(): void { this.form = this.fb.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], fiscalCode: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]], birthDate: ['', Validators.required], email: ['', [Validators.required, Validators.email]], phone: [''] }); }
  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }
  openEdit(patient: Patient): void {
    this.editingId = patient.id;
    this.form.patchValue({ firstName: patient.firstName, lastName: patient.lastName, fiscalCode: patient.fiscalCode, birthDate: patient.birthDate, email: patient.email, phone: patient.phone ?? '' });
    this.showModal = true;
  }
  closeModal(): void { this.showModal = false; }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: PatientRequest = { firstName: value.firstName, lastName: value.lastName, fiscalCode: value.fiscalCode.toUpperCase(), birthDate: value.birthDate, email: value.email, phone: value.phone || null };
    const request$ = this.editingId ? this.patientService.update(this.editingId, body) : this.patientService.create(body);
    request$.subscribe({ next: () => { this.alertService.show(this.editingId ? 'Patient updated' : 'Patient created'); this.closeModal(); this.load(); } });
  }
  delete(id: number): void {
    if (!confirm('Delete this patient?')) return;
    this.patientService.delete(id).subscribe({ next: () => { this.alertService.show('Patient deleted'); this.load(); } });
  }
  onSearch(e: Event): void {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    if (!query) { this.load(); return; }
    this.patientService.getAll().subscribe(all => this.patients = all.filter(p => (p.firstName + ' ' + p.lastName).toLowerCase().includes(query)));
  }
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}