import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ClientService} from './client.service';
import {Client, ClientRequest} from '../models/models';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should call GET /api/clients without search', () => {
      const mockClients: Client[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          birthDate: '1990-01-01',
          goal: 'Weight loss',
          createdAt: '2024-01-01'
        }
      ];

      service.getAll().subscribe(clients => {
        expect(clients).toEqual(mockClients);
      });

      const req = httpMock.expectOne('/api/clients');
      expect(req.request.method).toBe('GET');
      req.flush(mockClients);
    });

    it('should include search query param when provided', () => {
      const mockClients: Client[] = [];
      const searchTerm = 'Anna';

      service.getAll(searchTerm).subscribe(clients => {
        expect(clients).toEqual(mockClients);
      });

      const req = httpMock.expectOne(r => r.url === '/api/clients' && r.params.has('search'));
      expect(req.request.params.get('search')).toBe('Anna');
      expect(req.request.method).toBe('GET');
      req.flush(mockClients);
    });
  });

  describe('getById()', () => {
    it('should call GET /api/clients/:id', () => {
      const mockClient: Client = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01'
      };

      service.getById(1).subscribe(client => {
        expect(client).toEqual(mockClient);
      });

      const req = httpMock.expectOne('/api/clients/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockClient);
    });
  });

  describe('create()', () => {
    it('should call POST /api/clients with request body', () => {
      const requestBody: ClientRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        birthDate: '1995-05-15',
        goal: 'Build muscle'
      };

      const mockResponse: Client = {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        birthDate: '1995-05-15',
        goal: 'Build muscle',
        createdAt: '2024-01-15'
      };

      service.create(requestBody).subscribe(client => {
        expect(client).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/clients');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(requestBody);
      req.flush(mockResponse);
    });
  });

  describe('update()', () => {
    it('should call PUT /api/clients/:id', () => {
      const id = 1;
      const requestBody: ClientRequest = {
        firstName: 'John',
        lastName: 'Updated',
        email: 'john.updated@example.com'
      };

      const mockResponse: Client = {
        id: 1,
        firstName: 'John',
        lastName: 'Updated',
        email: 'john.updated@example.com',
        createdAt: '2024-01-01'
      };

      service.update(id, requestBody).subscribe(client => {
        expect(client).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/clients/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(requestBody);
      req.flush(mockResponse);
    });
  });

  describe('delete()', () => {
    it('should call DELETE /api/clients/:id', () => {
      const id = 1;

      service.delete(id).subscribe();

      const req = httpMock.expectOne(`/api/clients/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });
  });
});
