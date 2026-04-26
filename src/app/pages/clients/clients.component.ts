import { Component, inject } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientService } from '../../services/client.service';
import { AlertService } from '../../services/alert.service';
import { Client, ClientRequest } from '../../models/models';

@Component({
  selector: 'app-clients',
  imports: [ReactiveFormsModule, DatePipe, NgClass, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent {
  private readonly clientService = inject(ClientService);
  private readonly alertSvc      = inject(AlertService);
  private readonly fb            = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  clients: Client[] = [];
  loading           = false;
  showModal         = false;
  editingId: number | null = null;

  readonly form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    phone:     [''],
    birthDate: [''],
    goal:      ['']
  });

  constructor() {
    this.load();
  }

  load(search = ''): void {
    this.loading = true;
    this.clientService.getAll(search).subscribe({
      next: (data) => { this.clients = data; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  onSearch(e: Event): void { this.load((e.target as HTMLInputElement).value); }

  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }

  openEdit(client: Client): void {
    this.editingId = client.id;
    this.form.patchValue({
      firstName: client.firstName,
      lastName:  client.lastName,
      email:     client.email,
      phone:     client.phone    ?? '',
      birthDate: client.birthDate ?? '',
      goal:      client.goal     ?? ''
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const body: ClientRequest = {
      ...this.form.value,
      phone:     this.form.value.phone     || null,
      birthDate: this.form.value.birthDate || null,
      goal:      this.form.value.goal      || null
    };
    const req$ = this.editingId ? this.clientService.update(this.editingId, body) : this.clientService.create(body);
    req$.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Cliente aggiornato!' : 'Cliente creato!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questo cliente?')) return;
    this.clientService.delete(id).subscribe({
      next: () => { this.alertSvc.show('Cliente eliminato.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
