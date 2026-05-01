import {TestBed} from '@angular/core/testing';
import {BookingService, PendingBooking} from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  const booking: PendingBooking = {
    specialistId: 5,
    scheduledAt: '2024-01-15T10:00:00',
    serviceType: 'personal-training',
    appointmentType: 'fitness'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pendingBooking should be null initially', () => {
    expect(service.pendingBooking).toBeNull();
  });

  it('setPendingBooking() should store the booking', () => {
    service.setPendingBooking(booking);
    expect(service.pendingBooking).toEqual(booking);
  });

  it('clearPendingBooking() should remove the booking', () => {
    service.setPendingBooking(booking);
    expect(service.pendingBooking).toEqual(booking);
    service.clearPendingBooking();
    expect(service.pendingBooking).toBeNull();
  });

  it('setPendingBooking() with clinical type should store appointmentType and visitType', () => {
    const clinicalBooking: PendingBooking = {
      ...booking,
      appointmentType: 'clinical',
      visitType: 'follow-up'
    };
    service.setPendingBooking(clinicalBooking);
    expect(service.pendingBooking).toEqual(clinicalBooking);
    expect(service.pendingBooking?.appointmentType).toBe('clinical');
    expect(service.pendingBooking?.visitType).toBe('follow-up');
  });
});
