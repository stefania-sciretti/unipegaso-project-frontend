import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {TrainingPlanService} from './training-plan.service';
import {TrainingPlan, TrainingPlanRequest} from '../models/models';

describe('TrainingPlanService', () => {
  let service: TrainingPlanService;
  let httpMock: HttpTestingController;

  const mockPlan: TrainingPlan = {
    id: 1, clientId: 1, clientFullName: 'Anna Rossi',
    trainerId: 2, trainerFullName: 'Luca Siretta',
    title: 'Forza 8 settimane', weeks: 8,
    sessionsPerWeek: 3, active: true,
    createdAt: '2024-01-01T00:00:00'
  };
  const mockRequest: TrainingPlanRequest = {
    clientId: 1, trainerId: 2,
    title: 'Forza 8 settimane', weeks: 8,
    sessionsPerWeek: 3, active: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingPlanService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service  = TestBed.inject(TrainingPlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll() without clientId should GET /api/training-plans', () => {
    service.getAll().subscribe(list => expect(list).toEqual([mockPlan]));
    const req = httpMock.expectOne('/api/training-plans');
    expect(req.request.params.keys().length).toBe(0);
    expect(req.request.method).toBe('GET');
    req.flush([mockPlan]);
  });

  it('getAll(1) with clientId should include ?clientId=1 query param', () => {
    service.getAll(1).subscribe();
    const req = httpMock.expectOne(r => r.params.has('clientId'));
    expect(req.request.params.get('clientId')).toBe('1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getById(1) should GET /api/training-plans/1', () => {
    service.getById(1).subscribe(p => {
      expect(p).toEqual(mockPlan);
      expect(p.weeks).toBe(8);
    });
    const req = httpMock.expectOne('/api/training-plans/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlan);
  });

  it('create(request) should POST /api/training-plans with body', () => {
    service.create(mockRequest).subscribe(p => {
      expect(p).toEqual(mockPlan);
      expect(p.id).toBe(1);
    });
    const req = httpMock.expectOne('/api/training-plans');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockPlan);
  });

  it('update(1, request) should PUT /api/training-plans/1 with body', () => {
    service.update(1, mockRequest).subscribe(p => {
      expect(p).toEqual(mockPlan);
      expect(p.active).toBeTrue();
    });
    const req = httpMock.expectOne('/api/training-plans/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockPlan);
  });

  it('delete(1) should DELETE /api/training-plans/1 with 204', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/api/training-plans/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
