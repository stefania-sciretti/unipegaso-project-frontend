import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Report, ReportRequest, ReportService} from '../../services/report.service';
import {AlertService, AlertState} from '../../services/alert.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  loading = false;
  showFormModal = false;
  showDetailModal = false;
  editingId: number | null = null;
  selectedReport: Report | null = null;
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  constructor(
    private reportService: ReportService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

  ngOnInit(): void { this.buildForm(); this.load(); }

  load(): void {
    this.loading = true;
    this.reportService.getAll().subscribe({
      next: (data) => { this.reports = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      appointmentId: [null, Validators.required],
      diagnosis:     ['', Validators.required],
      prescription:  [''],
      doctorNotes:   ['']
    });
  }

  openCreate(): void { this.editingId = null; this.form.reset(); this.showFormModal = true; }

  openEdit(report: Report): void {
    this.editingId = report.id;
    this.form.patchValue({
      appointmentId: report.appointmentId,
      diagnosis:     report.diagnosis,
      prescription:  report.prescription ?? '',
      doctorNotes:   report.doctorNotes ?? ''
    });
    this.showFormModal = true;
  }

  openDetail(report: Report): void { this.selectedReport = report; this.showDetailModal = true; }

  closeFormModal(): void { this.showFormModal = false; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.value;
    const body: ReportRequest = {
      appointmentId: +value.appointmentId,
      diagnosis:     value.diagnosis,
      prescription:  value.prescription || null,
      doctorNotes:   value.doctorNotes || null
    };
    const request$ = this.editingId
      ? this.reportService.update(this.editingId, body)
      : this.reportService.create(body);
    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Report updated' : 'Report created');
        this.closeFormModal();
        this.load();
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
