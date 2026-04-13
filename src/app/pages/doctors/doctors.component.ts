import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Doctor, DoctorRequest, DoctorService} from '../../services/doctor.service';
import {AlertService, AlertState} from '../../services/alert.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule],
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  filtered: Doctor[] = [];
  loading = false;
  showModal = false;
  editingId: number | null = null;
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

  ngOnInit(): void { this.buildForm(); this.load(); }

  load(): void {
    this.loading = true;
    this.doctorService.getAll().subscribe({
      next: (data) => { this.doctors = data; this.filtered = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName:      ['', Validators.required],
      lastName:       ['', Validators.required],
      specialization: ['', Validators.required],
      email:          ['', [Validators.required, Validators.email]],
      licenseNumber:  ['', Validators.required]
    });
  }

  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }

  openEdit(doctor: Doctor): void {
    this.editingId = doctor.id;
    this.form.patchValue({
      firstName:      doctor.firstName,
      lastName:       doctor.lastName,
      specialization: doctor.specialization,
      email:          doctor.email,
      licenseNumber:  doctor.licenseNumber
    });
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const body: DoctorRequest = this.form.value;
    const request$ = this.editingId
      ? this.doctorService.update(this.editingId, body)
      : this.doctorService.create(body);
    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Doctor updated' : 'Doctor created');
        this.closeModal();
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this doctor?')) return;
    this.doctorService.delete(id).subscribe({
      next: () => { this.alertService.show('Doctor deleted'); this.load(); }
    });
  }

  onFilter(e: Event): void {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    this.filtered = query
      ? this.doctors.filter(d => d.specialization.toLowerCase().includes(query))
      : this.doctors;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
