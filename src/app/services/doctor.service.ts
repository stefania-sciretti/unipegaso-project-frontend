import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  licenseNumber: string;
  createdAt: string;
}

export interface DoctorRequest {
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  licenseNumber: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly base = '/api/doctors';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.base);
  }

  getById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.base}/${id}`);
  }

  create(body: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.base, body);
  }

  update(id: number, body: DoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
