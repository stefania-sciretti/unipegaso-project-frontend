import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingPlan, TrainingPlanRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TrainingPlanService {
  private readonly base = '/api/training-plans';
  private readonly http = inject(HttpClient);

  getAll(patientId?: number): Observable<TrainingPlan[]> {
    const params = patientId ? new HttpParams().set('patientId', patientId) : undefined;
    return this.http.get<TrainingPlan[]>(this.base, { params });
  }

  getById(id: number): Observable<TrainingPlan> {
    return this.http.get<TrainingPlan>(`${this.base}/${id}`);
  }

  create(body: TrainingPlanRequest): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(this.base, body);
  }

  update(id: number, body: TrainingPlanRequest): Observable<TrainingPlan> {
    return this.http.put<TrainingPlan>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
