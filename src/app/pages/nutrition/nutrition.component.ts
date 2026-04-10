import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DietPlanService } from '../../services/diet-plan.service';
import { ClientService } from '../../services/client.service';
import { TrainerService } from '../../services/trainer.service';
import { DietPlan, DietPlanRequest, Client } from '../../models/models';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nutrition.component.html'
})
export class NutritionComponent implements OnInit {
  plans: DietPlan[] = [];
  clients: Client[] = [];
  simonaId = 0;
  loading = false;
  alertMsg  = '';
  alertType = 'success';
  showModal = false;
  editingId: number | null = null;
  filterActive = '';
  form!: FormGroup;

  constructor(
    private svc: DietPlanService,
    private clientSvc: ClientService,
    private trainerSvc: TrainerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    forkJoin({
      plans: this.svc.getAll(),
      clients: this.clientSvc.getAll(),
      trainers: this.trainerSvc.getAll('NUTRITIONIST')
    }).subscribe(({ plans, clients, trainers }) => {
      this.plans = plans;
      this.clients = clients;
      this.simonaId = trainers[0]?.id ?? 1;
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
    this.svc.getAll().subscribe({
      next: (d) => { this.plans = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void { this.editingId = null; this.form.reset({ active: true }); this.showModal = true; }

  openEdit(p: DietPlan): void {
    this.editingId = p.id;
    this.form.patchValue({ clientId: p.clientId, title: p.title, description: p.description ?? '',
      calories: p.calories, durationWeeks: p.durationWeeks, active: p.active });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const body: DietPlanRequest = {
      clientId: +v.clientId, trainerId: this.simonaId, title: v.title,
      description: v.description || null, calories: v.calories || null,
      durationWeeks: v.durationWeeks || null, active: v.active ?? true
    };
    const obs = this.editingId ? this.svc.update(this.editingId, body) : this.svc.create(body);
    obs.subscribe({
      next: () => { this.showAlert(this.editingId ? 'Plan updated!' : 'Plan created!'); this.showModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Save failed', 'error')
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this diet plan?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.showAlert('Plan deleted.'); this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Delete failed', 'error')
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field); return !!(c && c.invalid && c.touched);
  }

  showAlert(msg: string, type = 'success'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => this.alertMsg = '', 3500);
  }
}
