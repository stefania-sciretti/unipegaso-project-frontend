import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {StaffService} from './trainer.service';
import {Staff} from '../models/models';

describe('StaffService', () => {
  let service: StaffService;
  let httpMock: HttpTestingController;

  const mockStaff: Staff = {
    id: 1, firstName: 'Luca', lastName: 'Siretta',
    role: 'PERSONAL_TRAINER', email: 'luca@test.com',
    createdAt: '2024-01-01T00:00:00'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service  = TestBed.inject(StaffService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll() without role should GET /api/trainers', () => {
    service.getAll().subscribe(list => {
      expect(list).toEqual([mockStaff]);
      expect(list[0].firstName).toBe('Luca');
    });
    const req = httpMock.expectOne('/api/trainers');
    expect(req.request.params.keys().length).toBe(0);
    expect(req.request.method).toBe('GET');
    req.flush([mockStaff]);
  });

  it('getAll(role) should include ?role query param', () => {
    service.getAll('PERSONAL_TRAINER').subscribe(list => {
      expect(list).toEqual([mockStaff]);
    });
    const req = httpMock.expectOne(r => r.params.has('role'));
    expect(req.request.params.get('role')).toBe('PERSONAL_TRAINER');
    expect(req.request.method).toBe('GET');
    req.flush([mockStaff]);
  });

  it('getById(1) should GET /api/trainers/1', () => {
    service.getById(1).subscribe(s => {
      expect(s).toEqual(mockStaff);
      expect(s.role).toBe('PERSONAL_TRAINER');
    });
    const req = httpMock.expectOne('/api/trainers/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockStaff);
  });
});
