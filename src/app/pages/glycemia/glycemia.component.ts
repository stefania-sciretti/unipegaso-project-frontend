import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';
import {GlycemiaService} from '../../services/glycemia.service';
import {ClientService} from '../../services/client.service';
import {TrainerService} from '../../services/trainer.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {Client, GlycemiaContext, GlycemiaMeasurement, GlycemiaMeasurementRequest} from '../../models/models';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-glycemia',
  standalone: true,
  imports: [
    CommonModule, AsyncPipe, FormsModule, ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './glycemia.component.html'
})
export class GlycemiaComponent implements OnInit {
  measurements: GlycemiaMeasurement[] = [];
  clients: Client[] = [];
  /** ID of the nutritionist trainer who performs glycemia measurements */
  nutritionistId = 0;
  loading = false;
  showModal = false;
  editingId: number | null = null;
  filterClientId: number | '' = '';
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  readonly contexts: { value: GlycemiaContext; label: string }[] = [
    { value: 'FASTING',      label: 'A digiuno' },
    { value: 'POST_MEAL_1H', label: 'Post-pasto 1h' },
    { value: 'POST_MEAL_2H', label: 'Post-pasto 2h' },
    { value: 'RANDOM',       label: 'Casuale' }
  ];

  constructor(
    private glycemiaService: GlycemiaService,
    private clientService: ClientService,
    private trainerService: TrainerService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  load(): void {
    this.loading = true;
    const clientId = this.filterClientId !== '' ? +this.filterClientId : undefined;
    forkJoin({
      measurements: this.glycemiaService.getAll(clientId),
      clients:      this.clientService.getAll(),
      trainers:     this.trainerService.getAll('NUTRITIONIST')
    }).subscribe({
      next: ({ measurements, clients, trainers }) => {
        this.measurements  = measurements;
        this.clients       = clients;
        this.nutritionistId = trainers[0]?.id ?? 1;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  buildForm(): void {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);

    this.form = this.fb.group({
      clientId:   [null, Validators.required],
      measuredAt: [localIso, Validators.required],
      valueMgDl:  [null, [Validators.required, Validators.min(20), Validators.max(600)]],
      context:    ['FASTING', Validators.required],
      notes:      ['']
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.buildForm();
    this.showModal = true;
  }

  openEdit(measurement: GlycemiaMeasurement): void {
    this.editingId = measurement.id;
    this.form.patchValue({
      clientId:   measurement.clientId,
      measuredAt: measurement.measuredAt.slice(0, 16),
      valueMgDl:  measurement.valueMgDl,
      context:    measurement.context,
      notes:      measurement.notes ?? ''
    });
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: GlycemiaMeasurementRequest = {
      clientId:   +value.clientId,
      trainerId:  this.nutritionistId,
      measuredAt: value.measuredAt,
      valueMgDl:  +value.valueMgDl,
      context:    value.context,
      notes:      value.notes || null
    };
    const request$ = this.editingId
      ? this.glycemiaService.update(this.editingId, body)
      : this.glycemiaService.create(body);

    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Misurazione aggiornata' : 'Misurazione registrata');
        this.closeModal();
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questa misurazione?')) return;
    this.glycemiaService.delete(id).subscribe({
      next: () => { this.alertService.show('Misurazione eliminata'); this.load(); }
    });
  }

  contextLabel(context: string): string {
    return this.contexts.find(c => c.value === context)?.label ?? context;
  }

  classColor(classification: string): string {
    const map: Record<string, string> = {
      NORMALE: 'badge-success', ATTENZIONE: 'badge-warning', ELEVATA: 'badge-danger'
    };
    return map[classification] ?? 'badge-secondary';
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
