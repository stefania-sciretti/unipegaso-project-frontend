import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ClientService} from '../../services/client.service';
import {AlertService, AlertState} from '../../services/alert.service';
import {Client, ClientRequest} from '../../models/models';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  showModal = false;
  editingId: number | null = null;
  form!: FormGroup;
  readonly alert$: Observable<AlertState | null>;

  constructor(
    private clientService: ClientService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.alert$ = this.alertService.alert$;
  }

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
    this.clientService.getAll(search).subscribe({
      next: (data) => { this.clients = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(e: Event): void {
    this.load((e.target as HTMLInputElement).value);
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(client: Client): void {
    this.editingId = client.id;
    this.form.patchValue({
      firstName: client.firstName,
      lastName:  client.lastName,
      email:     client.email,
      phone:     client.phone ?? '',
      birthDate: client.birthDate ?? '',
      goal:      client.goal ?? ''
    });
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
    const request$ = this.editingId
      ? this.clientService.update(this.editingId, body)
      : this.clientService.create(body);

    request$.subscribe({
      next: () => {
        this.alertService.show(this.editingId ? 'Client updated!' : 'Client created!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this client?')) return;
    this.clientService.delete(id).subscribe({
      next: () => { this.alertService.show('Client deleted.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
