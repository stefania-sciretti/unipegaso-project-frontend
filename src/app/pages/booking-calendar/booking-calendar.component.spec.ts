import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {BookingCalendarComponent} from './booking-calendar.component';
import {AppointmentService} from '../../services/appointment.service';
import {ClinicalAppointmentService} from '../../services/clinical-appointment.service';
import {DatePipe, registerLocaleData} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import localeIt from '@angular/common/locales/it';

describe('BookingCalendarComponent', () => {
  let component: BookingCalendarComponent;
  let fixture: ComponentFixture<BookingCalendarComponent>;

  const mockApptService = jasmine.createSpyObj('AppointmentService', ['getAll']);
  const mockClinicalService = jasmine.createSpyObj('ClinicalAppointmentService', ['getAll']);

  beforeAll(() => registerLocaleData(localeIt));

  beforeEach(async () => {
    mockApptService.getAll.calls.reset();
    mockClinicalService.getAll.calls.reset();
    mockApptService.getAll.and.returnValue(of([]));
    mockClinicalService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [BookingCalendarComponent],
      providers: [
        { provide: AppointmentService, useValue: mockApptService },
        { provide: ClinicalAppointmentService, useValue: mockClinicalService },
        { provide: LOCALE_ID, useValue: 'it-IT' },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should call getAll on both services on init', () => {
    expect(mockApptService.getAll).toHaveBeenCalledTimes(1);
    expect(mockClinicalService.getAll).toHaveBeenCalledTimes(1);
  });
});
