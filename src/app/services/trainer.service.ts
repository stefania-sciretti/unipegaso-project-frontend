import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly base = '/api/trainers';
  private readonly http = inject(HttpClient);

  getAll(role?: string): Observable<Staff[]> {
    const params = role ? new HttpParams().set('role', role) : undefined;
    return this.http.get<Staff[]>(this.base, { params });
  }

  getById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.base}/${id}`);
  }
}
