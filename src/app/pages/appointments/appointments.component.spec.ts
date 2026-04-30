import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AppointmentsComponent} from './appointments.component';
import {AppointmentService} from '../../services/appointment.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService} from '../../services/alert.service';

describe('AppointmentsComponent', () => {
  let component: AppointmentsComponent;
  let fixture: ComponentFixture<AppointmentsComponent>;

  const mockAppointmentService = jasmine.createSpyObj('AppointmentService',
    ['getAll', 'create', 'updateStatus', 'delete']);
  const mockClientService  = jasmine.createSpyObj('ClientService', ['getAll']);
  const mockTrainerService = jasmine.createSpyObj('StaffService', ['getAll']);
  const mockAlertService   = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockAppointmentService.getAll.calls.reset();
    mockClientService.getAll.calls.reset();
    mockTrainerService.getAll.calls.reset();

    mockAppointmentService.getAll.and.returnValue(of([]));
    mockClientService.getAll.and.returnValue(of([]));
    mockTrainerService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AppointmentsComponent],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: ClientService,      useValue: mockClientService },
        { provide: StaffService,       useValue: mockTrainerService },
        { provide: AlertService,       useValue: mockAlertService },
        { provide: ActivatedRoute,     useValue: { queryParams: of({}) } },
        { provide: Router,             useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(AppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should call getAll on init', () => {
    expect(mockAppointmentService.getAll).toHaveBeenCalled();
  });

  it('should load clients and trainers on init', () => {
    expect(mockClientService.getAll).toHaveBeenCalled();
    expect(mockTrainerService.getAll).toHaveBeenCalled();
  });

  it('appointments array starts empty', () => {
    expect(component.appointments).toEqual([]);
  });

  it('canCancel returns true for BOOKED appointment', () => {
    const appt = { status: 'BOOKED' } as any;
    expect(component.canCancel(appt)).toBeTrue();
  });

  it('canCancel returns false for COMPLETED appointment', () => {
    const appt = { status: 'COMPLETED' } as any;
    expect(component.canCancel(appt)).toBeFalse();
  });

  it('canCancel returns true for CONFIRMED appointment', () => {
    const appt = { status: 'CONFIRMED' } as any;
    expect(component.canCancel(appt)).toBeTrue();
  });

  it('canCancel returns false for CANCELLED appointment', () => {
    const appt = { status: 'CANCELLED' } as any;
    expect(component.canCancel(appt)).toBeFalse();
  });
});
