import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {TrainingPlanService} from '../../services/training-plan.service';
import {ClientService} from '../../services/client.service';
import {TrainerService} from '../../services/trainer.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {Client, TrainingPlan, TrainingPlanRequest} from '../../models/models';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './training.component.html'
})
export class TrainingComponent implements OnInit {
  plans: TrainingPlan[] = [];
  clients: Client[] = [];
  /** ID of the personal trainer assigned to new plans */
  personalTrainerId = 0;
  loading = false;
  showModal  = false;
  showDetail = false;
  editingId: number | null = null;
  selected: TrainingPlan | null = null;
  filterActive = '';
  filterClientId = '';
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  constructor(
    private trainingPlanService: TrainingPlanService,
    private clientService: ClientService,
    private trainerService: TrainerService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

  ngOnInit(): void {
    this.buildForm();
    forkJoin({
      plans:    this.trainingPlanService.getAll(),
      clients:  this.clientService.getAll(),
      trainers: this.trainerService.getAll('PERSONAL_TRAINER')
    }).subscribe(({ plans, clients, trainers }) => {
      this.plans            = plans;
      this.clients          = clients;
      this.personalTrainerId = trainers[0]?.id ?? 2;
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      clientId:        [null, Validators.required],
      title:           ['',   Validators.required],
      description:     [''],
      weeks:           [null],
      sessionsPerWeek: [null],
      active:          [true]
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
    this.trainingPlanService.getAll().subscribe({
      next: (data) => { this.plans = data; this.loading = false; },
      error: () => { this.loading = false; }
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
      clientId:        plan.clientId,
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
      clientId:        +value.clientId,
      trainerId:       this.personalTrainerId,
      title:           value.title,
      description:     value.description || null,
      weeks:           value.weeks || null,
      sessionsPerWeek: value.sessionsPerWeek || null,
      active:          value.active ?? true
    };
    const request$ = this.editingId
      ? this.trainingPlanService.update(this.editingId, body)
      : this.trainingPlanService.create(body);

    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Plan updated!' : 'Plan created!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this training plan?')) return;
    this.trainingPlanService.delete(id).subscribe({
      next: () => { this.alertService.show('Plan deleted.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
