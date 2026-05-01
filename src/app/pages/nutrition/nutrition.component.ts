import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DietPlanService } from '../../services/diet-plan.service';
import { PatientService } from '../../services/patient.service';
import { SpecialistService } from '../../services/specialist.service';
import { AlertService } from '../../services/alert.service';
import { Patient, DietPlan, DietPlanRequest } from '../../models/models';

@Component({
  selector: 'app-nutrition',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './nutrition.component.html'
})
export class NutritionComponent implements OnInit {
  private readonly dietPlanService = inject(DietPlanService);
  private readonly patientService  = inject(PatientService);
  private readonly specialistService = inject(SpecialistService);
  private readonly alertSvc        = inject(AlertService);
  private readonly fb              = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  plans: DietPlan[] = [];
  patients: Patient[] = [];
  nutritionistId = 0;
  loading        = false;
  showModal      = false;
  editingId: number | null = null;
  filterActive   = '';

  readonly form: FormGroup = this.fb.group({
    patientId:     [null, Validators.required],
    title:         ['',   Validators.required],
    description:   [''],
    calories:      [null],
    durationWeeks: [null],
    active:        [true]
  });

  constructor() {}

  ngOnInit(): void {
    forkJoin({
      plans:       this.dietPlanService.getAll(),
      patients:    this.patientService.getAll(),
      specialists: this.specialistService.getAll('NUTRITIONIST')
    }).subscribe(({ plans, patients, specialists }) => {
      this.plans          = plans;
      this.patients       = patients;
      this.nutritionistId = specialists[0]?.id ?? 1;
    });
  }

  get filtered(): DietPlan[] {
    if (this.filterActive === 'true')  return this.plans.filter(p => p.active);
    if (this.filterActive === 'false') return this.plans.filter(p => !p.active);
    return this.plans;
  }

  load(): void {
    this.loading = true;
    this.dietPlanService.getAll().subscribe({
      next: (data) => { this.plans = data; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ active: true });
    this.showModal = true;
  }

  openEdit(plan: DietPlan): void {
    this.editingId = plan.id;
    this.form.patchValue({
      patientId:     plan.patientId,
      title:         plan.title,
      description:   plan.description ?? '',
      calories:      plan.calories,
      durationWeeks: plan.durationWeeks,
      active:        plan.active
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: DietPlanRequest = {
      patientId:     +value.patientId,
      specialistId:  this.nutritionistId,
      title:         value.title,
      description:   value.description || null,
      calories:      value.calories || null,
      durationWeeks: value.durationWeeks || null,
      active:        value.active ?? true
    };
    const req$ = this.editingId ? this.dietPlanService.update(this.editingId, body) : this.dietPlanService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Piano aggiornato!' : 'Piano creato!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questo piano dieta?')) return;
    this.dietPlanService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Piano eliminato.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
