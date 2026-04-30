import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {Doctor, DoctorRequest, DoctorService} from './doctor.service';

describe('DoctorService', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;

  const mockDoctor: Doctor = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'Cardiology',
    email: 'john.doe@example.com',
    licenseNumber: 'LIC123456',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockRequest: DoctorRequest = {
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'Cardiology',
    email: 'john.doe@example.com',
    licenseNumber: 'LIC123456'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should return all doctors', () => {
    const mockDoctors: Doctor[] = [mockDoctor];

    service.getAll().subscribe((data) => {
      expect(data).toEqual(mockDoctors);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(1);
    });

    const req = httpMock.expectOne('/api/doctors');
    expect(req.request.method).toBe('GET');
    req.flush(mockDoctors);
  });

  it('getById(1) should return a doctor by id', () => {
    service.getById(1).subscribe((data) => {
      expect(data).toEqual(mockDoctor);
      expect(data.id).toBe(1);
      expect(data.firstName).toBe('John');
    });

    const req = httpMock.expectOne('/api/doctors/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockDoctor);
  });

  it('create(request) should create a doctor', () => {
    service.create(mockRequest).subscribe((data) => {
      expect(data).toEqual(mockDoctor);
      expect(data.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/doctors');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockDoctor);
  });

  it('update(1, request) should update a doctor', () => {
    service.update(1, mockRequest).subscribe((data) => {
      expect(data).toEqual(mockDoctor);
      expect(data.firstName).toBe('John');
    });

    const req = httpMock.expectOne('/api/doctors/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockDoctor);
  });

  it('delete(1) should delete a doctor', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('/api/doctors/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
