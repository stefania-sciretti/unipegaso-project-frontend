import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DietPlan, DietPlanRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DietPlanService {
  private readonly base = '/api/diet-plans';
  constructor(private http: HttpClient) {}

  getAll(clientId?: number): Observable<DietPlan[]> {
    const params = clientId ? new HttpParams().set('clientId', clientId) : undefined;
    return this.http.get<DietPlan[]>(this.base, { params });
  }

  getById(id: number): Observable<DietPlan> {
    return this.http.get<DietPlan>(`${this.base}/${id}`);
  }

  create(body: DietPlanRequest): Observable<DietPlan> {
    return this.http.post<DietPlan>(this.base, body);
  }

  update(id: number, body: DietPlanRequest): Observable<DietPlan> {
    return this.http.put<DietPlan>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
