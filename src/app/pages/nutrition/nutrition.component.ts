import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DietPlanService } from '../../services/diet-plan.service';
import { ClientService } from '../../services/client.service';
import { StaffService } from '../../services/trainer.service';
import { AlertService } from '../../services/alert.service';
import { Client, DietPlan, DietPlanRequest } from '../../models/models';

@Component({
  selector: 'app-nutrition',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './nutrition.component.html'
})
export class NutritionComponent {
  private readonly dietPlanService = inject(DietPlanService);
  private readonly clientService   = inject(ClientService);
  private readonly trainerService  = inject(StaffService);
  private readonly alertSvc        = inject(AlertService);
  private readonly fb              = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  plans: DietPlan[] = [];
  clients: Client[] = [];
  nutritionistId = 0;
  loading        = false;
  showModal      = false;
  editingId: number | null = null;
  filterActive   = '';

  readonly form: FormGroup = this.fb.group({
    clientId:      [null, Validators.required],
    title:         ['',   Validators.required],
    description:   [''],
    calories:      [null],
    durationWeeks: [null],
    active:        [true]
  });

  constructor() {
    forkJoin({
      plans:    this.dietPlanService.getAll(),
      clients:  this.clientService.getAll(),
      trainers: this.trainerService.getAll('NUTRITIONIST')
    }).subscribe(({ plans, clients, trainers }) => {
      this.plans          = plans;
      this.clients        = clients;
      this.nutritionistId = trainers[0]?.id ?? 1;
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
      clientId:      plan.clientId,
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
      clientId:      +value.clientId,
      trainerId:     this.nutritionistId,
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
