import {Component, OnInit} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {DietPlanService} from '../../services/diet-plan.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {Client, DietPlan, DietPlanRequest} from '../../models/models';

@Component({
    selector: 'app-nutrition',
    imports: [CommonModule, AsyncPipe, FormsModule, ReactiveFormsModule],
    templateUrl: './nutrition.component.html'
})
export class NutritionComponent implements OnInit {
  plans: DietPlan[] = [];
  clients: Client[] = [];
  /** ID of the nutritionist staff member assigned to new plans */
  nutritionistId = 0;
  loading = false;
  showModal = false;
  editingId: number | null = null;
  filterActive = '';
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  constructor(
    private dietPlanService: DietPlanService,
    private clientService: ClientService,
    private trainerService: StaffService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

  ngOnInit(): void {
    this.buildForm();
    forkJoin({
      plans:    this.dietPlanService.getAll(),
      clients:  this.clientService.getAll(),
      trainers: this.trainerService.getAll('NUTRITIONIST')
    }).subscribe(({ plans, clients, trainers }) => {
      this.plans         = plans;
      this.clients       = clients;
      this.nutritionistId = trainers[0]?.id ?? 1;
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      clientId:      [null, Validators.required],
      title:         ['',   Validators.required],
      description:   [''],
      calories:      [null],
      durationWeeks: [null],
      active:        [true]
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
      error: () => { this.loading = false; }
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
    const request$ = this.editingId
      ? this.dietPlanService.update(this.editingId, body)
      : this.dietPlanService.create(body);

    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Plan updated!' : 'Plan created!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this diet plan?')) return;
    this.dietPlanService.delete(id).subscribe({
      next: () => { this.alertService.show('Plan deleted.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
