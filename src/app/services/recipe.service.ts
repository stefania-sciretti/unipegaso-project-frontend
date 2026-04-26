import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Recipe, RecipeRequest} from '../models/models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly base = '/api/recipes';
  constructor(private http: HttpClient) {}

  getAll(category = '', search = ''): Observable<Recipe[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search)   params = params.set('search', search);
    return this.http.get<Recipe[]>(this.base, { params });
  }

  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.base}/${id}`);
  }

  create(body: RecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.base, body);
  }

  update(id: number, body: RecipeRequest): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
