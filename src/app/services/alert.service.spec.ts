import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {AlertService} from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('alert() is null initially', () => {
    expect(service.alert()).toBeNull();
  });

  it('show() sets alert with message and type', fakeAsync(() => {
    service.show('Test message', 'success');
    expect(service.alert()).toEqual({ message: 'Test message', type: 'success' });
    flush();
  }));

  it('show() defaults to success type', fakeAsync(() => {
    service.show('Hello');
    expect(service.alert()?.type).toBe('success');
    flush();
  }));

  it('show() auto-dismisses after 3500ms', fakeAsync(() => {
    service.show('Auto dismiss');
    expect(service.alert()).not.toBeNull();
    tick(3500);
    expect(service.alert()).toBeNull();
  }));

  it('clear() removes the alert immediately', fakeAsync(() => {
    service.show('To clear', 'error');
    service.clear();
    expect(service.alert()).toBeNull();
    flush();
  }));

  it('clear() cancels the auto-dismiss timer', fakeAsync(() => {
    service.show('To clear');
    service.clear();
    expect(service.alert()).toBeNull();
    // Timer must be cancelled: tick past dismiss window without error
    tick(3500);
    expect(service.alert()).toBeNull();
  }));

  it('show() with error type sets correct type', fakeAsync(() => {
    service.show('Error!', 'error');
    expect(service.alert()?.type).toBe('error');
    flush();
  }));

  it('show() with warning type sets correct type', fakeAsync(() => {
    service.show('Warning!', 'warning');
    expect(service.alert()?.type).toBe('warning');
    flush();
  }));

  it('show() called twice resets the dismiss timer', fakeAsync(() => {
    service.show('First');
    tick(2000);
    service.show('Second');
    tick(3499);
    expect(service.alert()).not.toBeNull();
    tick(1);
    expect(service.alert()).toBeNull();
  }));
});
