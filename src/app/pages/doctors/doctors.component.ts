import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Doctor, DoctorRequest, DoctorService } from '../../services/doctor.service';
import { AlertService, AlertState } from '../../services/alert.service';
export interface StaffMember {
  firstName: string;
  lastName: string;
  role: string;
  gender: 'male' | 'female';
  image: string;
  route: string;
}
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
  readonly staff: StaffMember[] = [
    { firstName: 'Simona',    lastName: 'Ruberti',  role: 'Biologa Nutrizionista',    gender: 'female', image: 'assets/icons/simona.webp',    route: '/staff/simona'    },
    { firstName: 'Luca',      lastName: 'Siretta',  role: 'Personal Trainer ISSA',    gender: 'male',   image: 'assets/icons/luca.webp',      route: '/staff/luca'      },
    { firstName: 'Sandro',    lastName: 'Scrigoni', role: 'Medico dello Sport',        gender: 'male',   image: 'assets/icons/sandro.webp',    route: '/staff/sandro'    },
    { firstName: 'Mihai',     lastName: 'Lavretti', role: 'Osteopata',                 gender: 'male',   image: 'assets/icons/mihai.webp',     route: '/staff/mihai'     },
    { firstName: 'Cristiana', lastName: 'Maratti',  role: 'Nutrizionista Sportiva',    gender: 'female', image: 'assets/icons/cristiana.webp', route: '/staff/cristiana' },
  ];
  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.alert$ = this.alertService.alert$;
  }
  ngOnInit(): void {
    this.buildForm();
    this.load();
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
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
    const req$ = this.editingId
      ? this.doctorService.update(this.editingId, body)
      : this.doctorService.create(body);
    req$.subscribe({
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
  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
