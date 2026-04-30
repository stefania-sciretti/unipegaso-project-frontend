import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {RecipeService} from './recipe.service';
import {Recipe, RecipeRequest} from '../models/models';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  const mockRecipe: Recipe = {
    id: 1, title: 'Pasta al Pomodoro', description: 'Classic',
    ingredients: 'Pasta, pomodoro', instructions: 'Boil pasta',
    calories: 400, category: 'Primo', createdAt: '2024-01-01T00:00:00'
  };
  const mockRequest: RecipeRequest = {
    title: 'Pasta al Pomodoro', description: 'Classic',
    ingredients: 'Pasta, pomodoro', instructions: 'Boil pasta',
    calories: 400, category: 'Primo'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service  = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll() without filters should GET /api/recipes', () => {
    service.getAll().subscribe(list => expect(list).toEqual([mockRecipe]));
    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush([mockRecipe]);
  });

  it('getAll(category) should include ?category query param', () => {
    service.getAll('Primo').subscribe();
    const req = httpMock.expectOne(r => r.params.has('category'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('category')).toBe('Primo');
    expect(req.request.params.has('search')).toBeFalse();
    req.flush([mockRecipe]);
  });

  it('getAll(search) should include ?search query param', () => {
    service.getAll('', 'pasta').subscribe();
    const req = httpMock.expectOne(r => r.params.has('search'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('pasta');
    expect(req.request.params.has('category')).toBeFalse();
    req.flush([]);
  });

  it('getAll(category, search) should include both query params', () => {
    service.getAll('Primo', 'pasta').subscribe();
    const req = httpMock.expectOne(r => r.params.has('category') && r.params.has('search'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('category')).toBe('Primo');
    expect(req.request.params.get('search')).toBe('pasta');
    req.flush([mockRecipe]);
  });

  it('getById(1) should GET /api/recipes/1', () => {
    service.getById(1).subscribe(r => expect(r).toEqual(mockRecipe));
    const req = httpMock.expectOne('/api/recipes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipe);
  });

  it('create(request) should POST /api/recipes with body', () => {
    service.create(mockRequest).subscribe(r => expect(r).toEqual(mockRecipe));
    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockRecipe);
  });

  it('update(1, request) should PUT /api/recipes/1 with body', () => {
    service.update(1, mockRequest).subscribe(r => expect(r).toEqual(mockRecipe));
    const req = httpMock.expectOne('/api/recipes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockRecipe);
  });

  it('delete(1) should DELETE /api/recipes/1 with 204', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/api/recipes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
