import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor, DoctorRequest, DoctorService } from '../../services/doctor.service';
import { AlertService } from '../../services/alert.service';

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
  imports: [ReactiveFormsModule],
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent {
  private readonly doctorService = inject(DoctorService);
  private readonly alertSvc      = inject(AlertService);
  private readonly fb            = inject(FormBuilder);
  private readonly router        = inject(Router);

  protected readonly alertSignal = this.alertSvc.alert;

  doctors:   Doctor[] = [];
  filtered:  Doctor[] = [];
  loading    = false;
  showModal  = false;
  editingId: number | null = null;

  readonly form: FormGroup = this.fb.group({
    firstName:      ['', Validators.required],
    lastName:       ['', Validators.required],
    specialization: ['', Validators.required],
    email:          ['', [Validators.required, Validators.email]],
    licenseNumber:  ['', Validators.required]
  });

  readonly staff: StaffMember[] = [
    { firstName: 'Simona',    lastName: 'Ruberti',  role: 'Biologa Nutrizionista',  gender: 'female', image: 'assets/icons/simona.webp',    route: '/staff/simona'    },
    { firstName: 'Luca',      lastName: 'Siretta',  role: 'Personal Trainer ISSA',  gender: 'male',   image: 'assets/icons/luca.webp',      route: '/staff/luca'      },
    { firstName: 'Sandro',    lastName: 'Scrigoni', role: 'Medico dello Sport',      gender: 'male',   image: 'assets/icons/sandro.webp',    route: '/staff/sandro'    },
    { firstName: 'Mihai',     lastName: 'Lavretti', role: 'Osteopata',               gender: 'male',   image: 'assets/icons/mihai.webp',     route: '/staff/mihai'     },
    { firstName: 'Cristiana', lastName: 'Maratti',  role: 'Nutrizionista Sportiva',  gender: 'female', image: 'assets/icons/cristiana.webp', route: '/staff/cristiana' },
  ];

  constructor() { this.load(); }

  navigateTo(route: string): void { this.router.navigate([route]); }

  load(): void {
    this.loading = true;
    this.doctorService.getAll().subscribe({
      next: (data) => { this.doctors = data; this.filtered = data; this.loading = false; },
      error: ()    => { this.loading = false; }
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
    const req$ = this.editingId ? this.doctorService.update(this.editingId, body) : this.doctorService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Medico aggiornato' : 'Medico creato');
        this.closeModal();
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questo medico?')) return;
    this.doctorService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Medico eliminato'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
