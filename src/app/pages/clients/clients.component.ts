import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client, ClientRequest } from '../../models/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  alertMsg  = '';
  alertType = 'success';
  showModal = false;
  editingId: number | null = null;
  form!: FormGroup;

  constructor(private svc: ClientService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     [''],
      birthDate: [''],
      goal:      ['']
    });
  }

  load(search = ''): void {
    this.loading = true;
    this.svc.getAll(search).subscribe({
      next: (data) => { this.clients = data; this.loading = false; },
      error: (err) => { this.showAlert(err.error?.message || 'Load failed', 'error'); this.loading = false; }
    });
  }

  onSearch(e: Event): void { this.load((e.target as HTMLInputElement).value); }

  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }

  openEdit(c: Client): void {
    this.editingId = c.id;
    this.form.patchValue({ firstName: c.firstName, lastName: c.lastName, email: c.email,
      phone: c.phone ?? '', birthDate: c.birthDate ?? '', goal: c.goal ?? '' });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const body: ClientRequest = {
      ...this.form.value,
      phone:     this.form.value.phone || null,
      birthDate: this.form.value.birthDate || null,
      goal:      this.form.value.goal || null
    };
    const obs = this.editingId ? this.svc.update(this.editingId, body) : this.svc.create(body);
    obs.subscribe({
      next: () => { this.showAlert(this.editingId ? 'Client updated!' : 'Client created!'); this.showModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Save failed', 'error')
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this client?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.showAlert('Client deleted.'); this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Delete failed', 'error')
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  showAlert(msg: string, type = 'success'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => this.alertMsg = '', 3500);
  }
}
