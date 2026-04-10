import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TrainingPlanService } from '../../services/training-plan.service';
import { ClientService } from '../../services/client.service';
import { TrainerService } from '../../services/trainer.service';
import { TrainingPlan, TrainingPlanRequest, Client } from '../../models/models';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './training.component.html'
})
export class TrainingComponent implements OnInit {
  plans: TrainingPlan[] = [];
  clients: Client[] = [];
  lucaId = 0;
  loading = false;
  alertMsg  = '';
  alertType = 'success';
  showModal  = false;
  showDetail = false;
  editingId: number | null = null;
  selected: TrainingPlan | null = null;
  filterActive = '';
  filterClientId = '';
  form!: FormGroup;

  constructor(
    private svc: TrainingPlanService,
    private clientSvc: ClientService,
    private trainerSvc: TrainerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    forkJoin({
      plans: this.svc.getAll(),
      clients: this.clientSvc.getAll(),
      trainers: this.trainerSvc.getAll('PERSONAL_TRAINER')
    }).subscribe(({ plans, clients, trainers }) => {
      this.plans = plans;
      this.clients = clients;
      this.lucaId = trainers[0]?.id ?? 2;
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      clientId:       [null, Validators.required],
      title:          ['',   Validators.required],
      description:    [''],
      weeks:          [null],
      sessionsPerWeek:[null],
      active:         [true]
    });
  }

  get filtered(): TrainingPlan[] {
    let list = this.plans;
    if (this.filterActive === 'true')  list = list.filter(p => p.active);
    if (this.filterActive === 'false') list = list.filter(p => !p.active);
    if (this.filterClientId) list = list.filter(p => p.clientId === +this.filterClientId);
    return list;
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({ next: (d) => { this.plans = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openDetail(p: TrainingPlan): void { this.selected = p; this.showDetail = true; }
  openCreate(): void { this.editingId = null; this.form.reset({ active: true }); this.showModal = true; }
  openEdit(p: TrainingPlan): void {
    this.editingId = p.id;
    this.form.patchValue({ clientId: p.clientId, title: p.title, description: p.description ?? '',
      weeks: p.weeks, sessionsPerWeek: p.sessionsPerWeek, active: p.active });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const body: TrainingPlanRequest = {
      clientId: +v.clientId, trainerId: this.lucaId, title: v.title,
      description: v.description || null, weeks: v.weeks || null,
      sessionsPerWeek: v.sessionsPerWeek || null, active: v.active ?? true
    };
    const obs = this.editingId ? this.svc.update(this.editingId, body) : this.svc.create(body);
    obs.subscribe({
      next: () => { this.showAlert(this.editingId ? 'Plan updated!' : 'Plan created!'); this.showModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Save failed', 'error')
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this training plan?')) return;
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
