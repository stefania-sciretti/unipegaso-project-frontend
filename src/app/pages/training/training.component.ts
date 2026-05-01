import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TrainingPlanService } from '../../services/training-plan.service';
import { PatientService } from '../../services/patient.service';
import { SpecialistService } from '../../services/specialist.service';
import { AlertService } from '../../services/alert.service';
import { Patient, TrainingPlan, TrainingPlanRequest } from '../../models/models';

@Component({
  selector: 'app-training',
  imports: [FormsModule, ReactiveFormsModule, DatePipe, NgClass],
  templateUrl: './training.component.html'
})
export class TrainingComponent implements OnInit {
  private readonly trainingPlanService = inject(TrainingPlanService);
  private readonly patientService      = inject(PatientService);
  private readonly specialistService   = inject(SpecialistService);
  private readonly alertSvc            = inject(AlertService);
  private readonly fb                  = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  plans: TrainingPlan[] = [];
  patients: Patient[] = [];
  personalTrainerId = 0;
  loading        = false;
  showModal      = false;
  showDetail     = false;
  editingId: number | null      = null;
  selected: TrainingPlan | null = null;
  filterActive    = '';
  filterPatientId = '';

  readonly form: FormGroup = this.fb.group({
    patientId:       [null, Validators.required],
    title:           ['',   Validators.required],
    description:     [''],
    weeks:           [null],
    sessionsPerWeek: [null],
    active:          [true]
  });

  constructor() {}

  ngOnInit(): void {
    forkJoin({
      plans:       this.trainingPlanService.getAll(),
      patients:    this.patientService.getAll(),
      specialists: this.specialistService.getAll('PERSONAL_TRAINER')
    }).subscribe(({ plans, patients, specialists }) => {
      this.plans             = plans;
      this.patients          = patients;
      this.personalTrainerId = specialists[0]?.id ?? 2;
    });
  }

  get filtered(): TrainingPlan[] {
    let list = this.plans;
    if (this.filterActive === 'true')  list = list.filter(p => p.active);
    if (this.filterActive === 'false') list = list.filter(p => !p.active);
    if (this.filterPatientId) list = list.filter(p => p.patientId === +this.filterPatientId);
    return list;
  }

  load(): void {
    this.loading = true;
    this.trainingPlanService.getAll().subscribe({
      next: (data) => { this.plans = data; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  openDetail(plan: TrainingPlan): void { this.selected = plan; this.showDetail = true; }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ active: true });
    this.showModal = true;
  }

  openEdit(plan: TrainingPlan): void {
    this.editingId = plan.id;
    this.form.patchValue({
      patientId:       plan.patientId,
      title:           plan.title,
      description:     plan.description ?? '',
      weeks:           plan.weeks,
      sessionsPerWeek: plan.sessionsPerWeek,
      active:          plan.active
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: TrainingPlanRequest = {
      patientId:       +value.patientId,
      specialistId:    this.personalTrainerId,
      title:           value.title,
      description:     value.description || null,
      weeks:           value.weeks || null,
      sessionsPerWeek: value.sessionsPerWeek || null,
      active:          value.active ?? true
    };
    const req$ = this.editingId ? this.trainingPlanService.update(this.editingId, body) : this.trainingPlanService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Scheda aggiornata!' : 'Scheda creata!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questa scheda di allenamento?')) return;
    this.trainingPlanService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Scheda eliminata.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
