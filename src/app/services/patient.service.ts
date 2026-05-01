import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PatientRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly base = '/api/patients';
  private readonly http = inject(HttpClient);

  getAll(search?: string): Observable<Patient[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<Patient[]>(this.base, { params });
  }

  search(query: string): Observable<Patient[]> {
    return this.getAll(query);
  }

  getById(id: number): Observable<Patient>                           { return this.http.get<Patient>(`${this.base}/${id}`); }
  create(body: PatientRequest): Observable<Patient>                  { return this.http.post<Patient>(this.base, body); }
  update(id: number, body: PatientRequest): Observable<Patient>      { return this.http.put<Patient>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<void>                               { return this.http.delete<void>(`${this.base}/${id}`); }
}
