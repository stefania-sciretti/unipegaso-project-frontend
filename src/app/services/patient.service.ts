import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface PatientRequest {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
  email: string;
  phone?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly base = '/api/patients';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> { return this.http.get<Patient[]>(this.base); }
  getById(id: number): Observable<Patient> { return this.http.get<Patient>(`${this.base}/${id}`); }
  create(body: PatientRequest): Observable<Patient> { return this.http.post<Patient>(this.base, body); }
  update(id: number, body: PatientRequest): Observable<Patient> { return this.http.put<Patient>(`${this.base}/${id}`, body); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
