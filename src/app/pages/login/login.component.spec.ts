import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {LoginComponent} from './login.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {BookingService} from '../../services/booking.service';
import {AppointmentService} from '../../services/appointment.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  const mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'register'], { isLoggedIn: false, currentUser: null });
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockBookingService = jasmine.createSpyObj('BookingService', ['clearPendingBooking'], { pendingBooking: null });
  const mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['create']);

  beforeEach(async () => {
    mockAuthService.login.calls.reset();
    mockAuthService.register.calls.reset();
    mockAuthService.login.and.returnValue(of(false));
    mockAuthService.register.and.returnValue(of(null));
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: BookingService, useValue: mockBookingService },
        { provide: AppointmentService, useValue: mockAppointmentService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
});
