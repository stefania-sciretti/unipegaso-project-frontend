import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialist } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SpecialistService {
  private readonly base = '/api/specialists';
  private readonly http = inject(HttpClient);

  getAll(role?: string): Observable<Specialist[]> {
    const params = role ? new HttpParams().set('role', role) : undefined;
    return this.http.get<Specialist[]>(this.base, { params });
  }

  getById(id: number): Observable<Specialist> {
    return this.http.get<Specialist>(`${this.base}/${id}`);
  }
}
