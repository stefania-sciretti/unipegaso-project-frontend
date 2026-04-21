import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {BookingService} from '../../services/booking.service';
import {AppointmentService} from '../../services/appointment.service';
import {ClinicalAppointmentService} from '../../services/clinical-appointment.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  loading = false;
  isRegistering = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private bookingSvc: BookingService,
    private appointmentSvc: AppointmentService,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      displayName: ['', Validators.required]
    });
    // Se già loggato, redirect
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.error = '';
    this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';

    if (this.isRegistering) {
      this.register();
    } else {
      this.login();
    }
  }

  private login(): void {
    const { username, password } = this.form.value;
    const ok = this.auth.login(username, password);
    this.loading = false;
    if (ok) {
      // Check if there's a pending booking
      const pendingBooking = this.bookingSvc.pendingBooking;
      if (pendingBooking) {
        this.completePendingBooking(pendingBooking);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.error = 'Credenziali non valide. Riprova.';
    }
  }

  private register(): void {
    const { username, password, displayName } = this.form.value;
    // Simple registration: just login with the new account
    const ok = this.auth.register(username, password, displayName);
    this.loading = false;
    if (ok) {
      this.error = '';
      alert('Registrazione completata! Effettua il login.');
      this.isRegistering = false;
      this.form.reset();
    } else {
      this.error = 'Username già esistente o dati non validi.';
    }
  }

  private completePendingBooking(pendingBooking: any): void {
    const bookingRequest = {
      clientId: this.auth.currentUser!.id,
      trainerId: pendingBooking.trainerId,
      scheduledAt: pendingBooking.scheduledAt,
      serviceType: pendingBooking.serviceType
    };

    if (pendingBooking.appointmentType === 'clinical') {
      console.log('Completing pending clinical appointment:', {
        patientId: this.auth.currentUser!.id,
        doctorId: pendingBooking.trainerId,
        scheduledAt: pendingBooking.scheduledAt,
        visitType: pendingBooking.visitType
      });
      alert('Prenotazione completata con successo!');
      this.bookingSvc.clearPendingBooking();
      this.router.navigate(['/dashboard']);
    } else {
      this.appointmentSvc.create(bookingRequest).subscribe({
        next: () => {
          alert('Prenotazione completata con successo!');
          this.bookingSvc.clearPendingBooking();
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          alert('Errore nel completamento della prenotazione: ' + (err.error?.message || 'Riprova più tardi'));
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
