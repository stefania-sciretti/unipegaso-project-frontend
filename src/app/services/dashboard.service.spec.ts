import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {DashboardService} from './dashboard.service';
import {DashboardStats} from '../models/models';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockStats: DashboardStats = {
    totalClients: 5,
    totalAppointments: 10,
    bookedAppointments: 3,
    completedAppointments: 7,
    activeDietPlans: 4,
    activeTrainingPlans: 6,
    totalRecipes: 15
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStats() calls GET /api/dashboard and returns stats', () => {
    service.getStats().subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne('/api/dashboard');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });
});
